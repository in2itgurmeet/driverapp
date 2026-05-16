import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonicModule,RouterModule],
})
export class AppComponent {
  constructor() {}
}
