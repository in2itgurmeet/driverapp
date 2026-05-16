import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  bagHandleOutline,
  gridOutline,
  personOutline
} from 'ionicons/icons';
@Component({
  selector: 'app-tabs',
  imports: [IonicModule, CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {

  constructor(public router: Router) {
    addIcons({
      'home-outline': homeOutline,
      'bag-handle-outline': bagHandleOutline,
      'grid-outline': gridOutline,
      'person-outline': personOutline
    });
  }
  ngOnInit() {}

}
