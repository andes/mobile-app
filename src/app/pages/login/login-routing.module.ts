import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisclaimerPage } from './disclaimers/accept-disclaimer';

import { LoginPage } from './login.page';
import { OrganizacionesPage } from './organizaciones/organizaciones';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'disclaimer',
    component: DisclaimerPage
  },
  {
    path: 'organizaciones',
    component: OrganizacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
