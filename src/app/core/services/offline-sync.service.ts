import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Network, ConnectionStatus } from '@capacitor/network';
import { Apiservice } from '../../driver/service/apiservice';
import { ToastController } from '@ionic/angular';

const OFFLINE_POD_KEY = 'offline_pods';

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {
  private _storage: Storage | null = null;
  private isOnline: boolean = true;

  constructor(
    private storage: Storage,
    private api: Apiservice,
    private toastController: ToastController
  ) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    const status = await Network.getStatus();
    this.isOnline = status.connected;

    // Listen for network changes
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      this.isOnline = status.connected;
      if (this.isOnline) {
        this.syncOfflineData();
      }
    });

    // Attempt initial sync on boot if online
    if (this.isOnline) {
      this.syncOfflineData();
    }
  }

  public async getNetworkStatus(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }

  // Save POD offline
  public async saveOfflinePod(orderId: string, deliveryData: any) {
    const pods = await this._storage?.get(OFFLINE_POD_KEY) || [];
    pods.push({ orderId, deliveryData, timestamp: new Date().toISOString() });
    await this._storage?.set(OFFLINE_POD_KEY, pods);
    this.showToast('You are offline. POD saved locally. Will sync when online.');
  }

  // Sync data to backend
  private async syncOfflineData() {
    const pods = await this._storage?.get(OFFLINE_POD_KEY) || [];

    if (pods.length === 0) return;

    this.showToast(`Syncing ${pods.length} offline POD(s) to server...`);

    let syncErrors = false;
    let successfulSyncs: any[] = [];

    for (let pod of pods) {
      try {
        await this.api.updateOrderStatus(pod.orderId, 'Delivered').toPromise();

        // Remove from list if successful
        successfulSyncs.push(pod);
      } catch (e) {
        console.error('Failed to sync POD for order ' + pod.orderId, e);
        syncErrors = true;
      }
    }

    // Filter out successful ones
    const remainingPods = pods.filter((p: any) => !successfulSyncs.includes(p));
    await this._storage?.set(OFFLINE_POD_KEY, remainingPods);

    if (!syncErrors && successfulSyncs.length > 0) {
      this.showToast('Offline PODs synced successfully!');
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
