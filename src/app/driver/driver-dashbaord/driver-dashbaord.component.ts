import { IonicModule } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { menuOutline, notificationsOutline, closeCircleSharp, bagHandleOutline, gridOutline, settings, logOut, flash } from 'ionicons/icons';
import { SocketService } from 'src/app/service/socket.service';
import { Apiservice } from '../service/apiservice';
@Component({
  selector: 'app-driver-dashbaord',
  templateUrl: './driver-dashbaord.component.html',
  styleUrls: ['./driver-dashbaord.component.scss'],
  imports: [IonicModule, CommonModule,]
})
export class DriverDashbaordComponent {
  constructor(private socketService: SocketService, private service: Apiservice) { }
  orders: any[] = [];

  ionViewWillEnter() {
    this.getOrders();

    this.socketService.socket.on('notification', () => {
      this.getOrders();
    });
  }

  getOrders() {
    this.service.getDriverOrders().subscribe((res: any) => {
      this.orders = res.data;
    });
  }

  acceptOrder(item: any) {
    this.service.acceptOrder(item._id).subscribe((res: any) => {
      this.getOrders();
    });
  }

  rejectOrder(item: any) {
    item.rejected = true;
    this.service.rejectOrder(item._id).subscribe((res: any) => {
      this.getOrders();
    });
  }
}