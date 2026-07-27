import { IonicModule } from '@ionic/angular';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  menuOutline,
  notificationsOutline,
  chevronDownOutline,
  checkmarkCircleOutline,
  cubeOutline,
  calendarOutline,
  timeOutline,
  ellipseOutline,
  ellipse
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { SocketService } from 'src/app/service/socket.service';
import { Apiservice } from '../service/apiservice';

@Component({
  selector: 'app-driver-dashbaord',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './driver-dashbaord.component.html',
  styleUrls: ['./driver-dashbaord.component.scss'],
})
export class DriverDashbaordComponent {
  orders: any[] = []; // Available jobs to accept
  currentTask: any = null; // Active trip in progress
  upcomingTask: any = null; // Next assigned trip
  recentTasks: any[] = []; // Completed trips

  notifications: any[] = [];
  unreadCount: number = 0;
  currentLocation: string = 'Noida Sector 62, UP';
  profileImage: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  // Driver Statistics Tiles
  totalCompletedTrips: number = 0;
  totalEarnings: number = 0;
  totalTips: number = 0;
  totalKmTravelled: number = 0;

  constructor(
    private socketService: SocketService,
    private service: Apiservice,
    private router: Router
  ) {
    addIcons({
      'menu-outline': menuOutline,
      'notifications-outline': notificationsOutline,
      'chevron-down-outline': chevronDownOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'cube-outline': cubeOutline,
      'calendar-outline': calendarOutline,
      'time-outline': timeOutline,
      'ellipse-outline': ellipseOutline,
      'ellipse': ellipse
    });
  }

  ionViewWillEnter() {
    this.refreshDashboard();

    // Socket listener for new notification pings
    this.socketService.socket.on('notification', () => {
      this.refreshDashboard();
    });

    // Socket listener for order status changes
    this.socketService.socket.on('orderStatusUpdated', () => {
      this.refreshDashboard();
    });
  }

  refreshDashboard() {
    this.getAvailableOrders();
    this.getMyTasks();
    this.getNotificationsList();
    this.getProfileImage();
    this.getDriverStatistics();
  }

  getProfileImage() {
    this.service.getProfileImage().subscribe({
      next: (res: any) => {
        if (res?.data?.profileImage) {
          this.profileImage = res.data.profileImage;
        }
      },
      error: (err) => console.error(err)
    });
  }

  getDriverStatistics() {
    this.service.getDriverStats().subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.totalCompletedTrips = res.data.totalCompleted || 0;
          this.totalEarnings = res.data.totalEarnings || 0;
          this.totalTips = res.data.totalTips || 0;
          this.totalKmTravelled = res.data.totalKm || 0;
        }
      },
      error: (err) => console.error(err)
    });
  }

  getAvailableOrders() {
    this.service.getDriverOrders().subscribe({
      next: (res: any) => {
        this.orders = res.data || [];
      },
      error: (err) => console.error(err)
    });
  }

  getMyTasks() {
    this.service.myOrderHistory().subscribe({
      next: (res: any) => {
        const myJobs = res.data || [];

        // Find current task in progress
        this.currentTask = myJobs.find(
          (j: any) => j.status === 'Pickup Started' || j.status === 'In-Transit'
        ) || null;

        // Find upcoming task assigned but not started
        this.upcomingTask = myJobs.find(
          (j: any) => j.status === 'Assigned'
        ) || null;

        // Recent tasks are completed (Delivered/Cancelled)
        this.recentTasks = myJobs.filter(
          (j: any) => j.status === 'Delivered' || j.status === 'Cancelled'
        );
      },
      error: (err) => console.error(err)
    });
  }

  getNotificationsList() {
    this.service.getNotifications().subscribe({
      next: (res: any) => {
        this.notifications = res.data || [];
        this.unreadCount = res.unreadCount || 0;
      },
      error: (err) => console.error(err)
    });
  }

  acceptOrder(item: any) {
    this.service.acceptOrder(item._id).subscribe({
      next: (res: any) => {
        this.refreshDashboard();
      },
      error: (err) => console.error(err)
    });
  }

  rejectOrder(item: any) {
    item.rejected = true;
    this.service.rejectOrder(item._id).subscribe({
      next: (res: any) => {
        this.refreshDashboard();
      },
      error: (err) => console.error(err)
    });
  }

  markAsRead(notification: any, event: Event) {
    event.stopPropagation(); // Avoid closing popover
    this.service.markNotificationAsRead(notification._id).subscribe({
      next: (res: any) => {
        notification.isRead = true;
        if (this.unreadCount > 0) {
          this.unreadCount--;
        }
      },
      error: (err) => console.error(err)
    });
  }

  markAllAsRead() {
    const unread = this.notifications.filter(n => !n.isRead);
    unread.forEach(n => {
      this.service.markNotificationAsRead(n._id).subscribe({
        next: () => {
          n.isRead = true;
        }
      });
    });
    this.unreadCount = 0;
  }

  viewTaskDetails(order: any) {
    if (order._id) {
      this.router.navigate(['/dashboard/order-detail', order._id]);
    }
  }

  goToProfile() {
    this.router.navigate(['/dashboard/profile']);
  }

  getScore(status: string): string {
    if (status === 'Delivered') return '95% Score';
    if (status === 'Cancelled') return 'N/A';
    return '100% Score';
  }

  getScoreClass(status: string): string {
    if (status === 'Delivered') return 'score-green';
    return 'score-gray';
  }
}