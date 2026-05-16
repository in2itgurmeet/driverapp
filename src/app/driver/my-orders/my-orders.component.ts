import { IonicModule } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apiservice } from '../service/apiservice';
import { Router, RouterLink } from '@angular/router';
import { DefultUsageService } from 'src/app/service/defult-usage.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-my-orders',
  imports: [IonicModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent {

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();
  orderData: any[] = [];
  allOrders: any[] = [];
  activeTab: number = 1;
  tabStatusMap: any = {
    1: 'All',
    2: 'Draft',
    3: 'Booked',
    4: 'Assigned',
    5: 'In-Transit',
    6: 'Delivered',
    7: 'Cancelled'
  };

  constructor(private api: Apiservice, private router: Router, private defultServise: DefultUsageService) { }

  setActiveTab(tabIndex: number): void {
    this.activeTab = tabIndex;
    const search =
      this.searchControl.value?.trim() || '';
    const status =
      this.activeTab === 1
        ? ''
        : this.tabStatusMap[this.activeTab];
    this.api.myOrderHistory(search, status)
      .subscribe({
        next: (res: any) => {
          this.orderData = res.data;
        }
      });
  }

  ionViewWillEnter() {
    this.getOrderList();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((search: string | null) => {
          const status =
            this.activeTab === 1
              ? ''
              : this.tabStatusMap[this.activeTab];

          return this.api.myOrderHistory(
            search?.trim() || '',
            status
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: any) => {
          this.orderData = res.data;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
  }
  getOrderList() {
    this.api.myOrderHistory().subscribe({
      next: (res: any) => {
        this.allOrders = res.data;
        this.orderData = [...this.allOrders];
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  /**
   * @description get orders
   * @author Gurmeet kumar
   */

  /**
   * @description filter data by status
   * @author Gurmeet kumar
   */
  filterData() {
    const selectedStatus = this.tabStatusMap[this.activeTab];

    if (selectedStatus === 'All') {
      this.orderData = this.allOrders;
    } else {
      this.orderData = this.allOrders.filter(
        item => item.status === selectedStatus
      );
    }
  }


  getStatusClass(status: string) {
    switch (status) {
      case 'Draft':
        return 'bg-warning text-dark';
      case 'Booked':
        return 'bg-primary text-white';
      case 'Assigned':
        return 'bg-secondary text-white';

      case 'Pickup Started':
        return 'bg-warning text-dark';
      case 'In-Transit':
        return 'bg-info text-white';
      case 'Delivered':
        return 'bg-success text-white';
      case 'Cancelled':
        return 'bg-danger text-white';
      default:
        return 'bg-dark text-white';
    }
  }

  isButtonDisabled(status: string): boolean {
    return status === 'Delivered' || status === 'Cancelled';
  }

  /**
   * @description get button text
   * @param status 
   * @returns 
   */
  getButtonText(status: string): string {
    switch (status) {
      case 'Pending':
        return 'Book Now';
      case 'Booked':
        return 'View Details';
      case 'In-Transit':
        return 'Track Order';
      case 'Delivered':
        return 'Completed';
      case 'Cancelled':
        return 'Cancelled';
      default:
        return 'Book Now';
    }
  }

  /**
    * @description handle action by status
    * @param item by action
    * @author Gurmeet kumar
    */
  handleAction(item: any) {
    switch (item.status) {
      case 'Pending':
        this.router.navigate(['/indexpage/booking'], {
          queryParams: { orderId: item.orderId }
        });
        break;
      case 'Booked':
        this.router.navigate(['/indexpage/order-details', item.orderId]);
        break;
      case 'In-Transit':
        this.router.navigate(['/indexpage/tracking-Order', item.orderId]);
        break;
      default:
        console.log('No action for this status');
    }
  }




  /**
   * @description cancel order 
   * @param item 
   * @returns 
   */
  cancelOrder(item: any) {
    if (!this.canCancel(item.status)) return;

    // this.api.updateStatus(item.id, 'Cancelled').subscribe({
    //   next: () => {
    //     item.status = 'Cancelled';


    //   },
    //   error: (err:any) => {
    //     console.log(err);


    //   }
    // });
  }


  canCancel(status: string): boolean {
    return status !== 'Delivered' && status !== 'Cancelled';
  }


  getLorryReciept(event: any) {
    if (event) {
      // this.route.navigate(['/indexpage/lorry-details/', event]);
    }
  }
  getOrderDetails(event: any) {
    if (event) {
      this.router.navigate(['/indexpage/lorry-details', event]);
    }
  }



}