import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  private notificationCount = new BehaviorSubject<number>(0);
  notificationCount$ = this.notificationCount.asObservable();

  constructor() {

    this.socket = io('http://localhost:8080');

    const userId = localStorage.getItem('userId');

    if (userId) {
      this.socket.emit('join', userId);
    }

    this.socket.on('notification', (data: any) => {
      console.log('Notification Received:', data);

      const current = this.notificationCount.value;
      this.notificationCount.next(current + 1);
    });
  }

  resetCount() {
    this.notificationCount.next(0);
  }
}