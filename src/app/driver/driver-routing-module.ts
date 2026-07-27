import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./driver-dashbaord/driver-dashbaord.component').then(m => m.DriverDashbaordComponent)
      },
      {
        path: 'myOrders',
        loadComponent: () => import('./my-orders/my-orders.component').then(m => m.MyOrdersComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'order-detail/:id',
    loadComponent: () => import('./order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
