import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
