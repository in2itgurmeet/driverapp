import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverDashbaordComponent } from './driver-dashbaord/driver-dashbaord.component';
import { SettingsComponent } from './settings/settings.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ProfileComponent } from './profile/profile.component';
import { TabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [

      {
        path: 'home',
        component: DriverDashbaordComponent
      },

      {
        path: 'myOrders',
        component: MyOrdersComponent
      },

      {
        path: 'settings',
        component: SettingsComponent
      },

      {
        path: 'profile',
        component: ProfileComponent
      },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }

    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
