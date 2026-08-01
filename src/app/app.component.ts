import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

import { OfflineSyncService } from './core/services/offline-sync.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonicModule,RouterModule],
})
export class AppComponent {
  constructor(private offlineSync: OfflineSyncService) {
    addIcons(allIcons);
  }
}
