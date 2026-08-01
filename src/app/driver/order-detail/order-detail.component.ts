import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Apiservice } from '../service/apiservice';
import { OfflineSyncService } from '../../core/services/offline-sync.service';
import { arrowBackOutline, callOutline, mapOutline, checkmarkCircleOutline, documentTextOutline, imageOutline, createOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  @ViewChild('sigCanvas', { static: false }) sigCanvas!: ElementRef<HTMLCanvasElement>;

  orderId: string = '';
  orderData: any = null;
  loading: boolean = true;

  // POD Modal states
  isPodModalOpen: boolean = false;
  receiverName: string = '';
  receiverMobile: string = '';
  remarks: string = '';
  deliveryPhotoBase64: string = '';

  // Signature canvas state
  private isDrawing: boolean = false;
  private ctx!: CanvasRenderingContext2D;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: Apiservice,
    private offlineSync: OfflineSyncService,
    private toastController: ToastController
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'call-outline': callOutline,
      'map-outline': mapOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'document-text-outline': documentTextOutline,
      'image-outline': imageOutline,
      'create-outline': createOutline
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderId = id;
        this.loadOrderDetails();
      }
    });
  }

  loadOrderDetails() {
    this.loading = true;
    this.api.getOrderById(this.orderId).subscribe({
      next: (res: any) => {
        this.orderData = res.data;
        this.receiverName = this.orderData?.delivery?.person || '';
        this.receiverMobile = this.orderData?.delivery?.phone || '';
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load order details', err);
        this.showToast('Failed to load trip details', 'danger');
        this.loading = false;
      }
    });
  }

  updateStatus(newStatus: string) {
    this.api.updateOrderStatus(this.orderData._id, newStatus).subscribe({
      next: (res: any) => {
        this.showToast(`Trip updated to: ${newStatus}`, 'success');
        this.loadOrderDetails();
      },
      error: (err: any) => {
        console.error('Failed to update status', err);
        this.showToast(err.error?.message || 'Failed to update status', 'danger');
      }
    });
  }

  openPodModal() {
    this.isPodModalOpen = true;
    // Set timeout to ensure canvas is rendered
    setTimeout(() => {
      this.initCanvas();
    }, 300);
  }

  closePodModal() {
    this.isPodModalOpen = false;
  }

  // --- Signature Pad Canvas drawing ---
  initCanvas() {
    if (!this.sigCanvas) return;
    const canvas = this.sigCanvas.nativeElement;
    
    // Set appropriate canvas sizing for mobile
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 300;
    canvas.height = 150;

    const context = canvas.getContext('2d');
    if (context) {
      this.ctx = context;
      this.ctx.strokeStyle = '#1a3038';
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    }
  }

  startDrawing(ev: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    const pos = this.getCoords(ev);
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
    ev.preventDefault();
  }

  draw(ev: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    const pos = this.getCoords(ev);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    ev.preventDefault();
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearSignature() {
    if (!this.ctx || !this.sigCanvas) return;
    const canvas = this.sigCanvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  private getCoords(ev: MouseEvent | TouchEvent): { x: number, y: number } {
    const canvas = this.sigCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;

    if (window.TouchEvent && ev instanceof TouchEvent) {
      clientX = ev.touches[0].clientX;
      clientY = ev.touches[0].clientY;
    } else if (ev instanceof MouseEvent) {
      clientX = ev.clientX;
      clientY = ev.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // --- Photo Upload conversion ---
  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.deliveryPhotoBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async submitPOD() {
    if (!this.receiverName.trim()) {
      this.showToast('Please enter receiver name', 'warning');
      return;
    }

    let signatureImage = '';
    // Check if drawing canvas has signature
    if (this.sigCanvas) {
      const canvas = this.sigCanvas.nativeElement;
      signatureImage = canvas.toDataURL('image/png');
    }

    const payload = {
      signatureImage: signatureImage,
      deliveryPhoto: this.deliveryPhotoBase64,
      remarks: this.remarks,
      receiverName: this.receiverName,
      receiverMobile: this.receiverMobile
    };

    const isOnline = await this.offlineSync.getNetworkStatus();

    if (!isOnline) {
      await this.offlineSync.saveOfflinePod(this.orderData._id, payload);
      this.closePodModal();
      this.orderData.status = 'Delivered'; // Optimistic UI update
      setTimeout(() => {
        this.router.navigate(['/dashboard/myOrders']);
      }, 1000);
      return;
    }

    this.api.uploadPOD(this.orderData._id, payload).subscribe({
      next: (res: any) => {
        this.showToast('Proof of Delivery submitted successfully', 'success');
        this.closePodModal();
        this.loadOrderDetails();
        // Redirect back to dashboard/my orders after a short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard/myOrders']);
        }, 1000);
      },
      error: (err: any) => {
        console.error('Failed to upload POD', err);
        this.showToast(err.error?.message || 'Failed to upload POD', 'danger');
      }
    });
  }

  // Helpers
  async showToast(msg: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  callNumber(phone: string) {
    if (phone) {
      window.open(`tel:${phone}`, '_system');
    }
  }

  navigateAddress(address: string) {
    if (address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_system');
    }
  }
}
