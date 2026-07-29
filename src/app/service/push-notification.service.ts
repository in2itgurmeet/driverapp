import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(private http: HttpClient) {}

  public initPushNotifications() {
    if (Capacitor.isNativePlatform()) {
      this.requestPermissions();
    } else {
      console.log('Push notifications are only available on native devices.');
    }
  }

  private requestPermissions() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.warn('Push notification permissions denied');
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('FCM Token generated: ', token.value);
      this.saveTokenToBackend(token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        // You could emit an event here to update the dashboard
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  private saveTokenToBackend(token: string) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http.put(`${environment.apiUrl}/fcm-token`, { token }).subscribe({
      next: () => console.log('FCM token saved successfully.'),
      error: (err) => console.error('Failed to save FCM token', err)
    });
  }
}
