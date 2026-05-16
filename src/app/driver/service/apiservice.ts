import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Apiservice {
  constructor(private http: HttpClient) { }


  registerDriver(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/driver/register`, data);
  }

  loginDriver(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/driver/login`, data);
  }

  getAllNotifications(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/driver/profile`);
  }
  getProfileImage(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/driver/profile-image`);
  }
  uploadImage(data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/auth/driver/profile-image`, data);
  }
  getDriverProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/driver/profile`);
  }
  updateDriverProfile(data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/auth/driver/profile`, data);
  }
  getUnreadCount(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/notification/unread-count`);
  }
  markAsRead(id: string): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/notification/read/${id}`, {});
  }


  // ================= DRIVER ORDERS =================
  getDriverOrders(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/driver-order/orders`);
  }

  acceptOrder(orderId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/driver-order/accept/${orderId}`, {});
  }

  rejectOrder(orderId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/driver-order/reject/${orderId}`, {});
  }

  myOrderHistory(search: string = '',status: string = ''): Observable<any> {
    let query = `?search=${search}`;
    if (status) {
      query += `&status=${status}`;
    }
    return this.http.get(
      `${environment.apiUrl}/driver-order/history${query}`
    );
  }
}
