import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  bagHandleOutline,
  gridOutline,
  personOutline,
  arrowForwardOutline
} from 'ionicons/icons';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule,RouterModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(public router: Router) {
    addIcons({
      'home-outline': homeOutline,
      'bag-handle-outline': bagHandleOutline,
      'grid-outline': gridOutline,
      'person-outline': personOutline,
      'arrow-forward-outline': arrowForwardOutline
    });
  }

  ngOnInit() { }

  hideHeader(): boolean {
    return this.router.url.includes('/dashboard/myOrders');
  }
}
