import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrganizacionesPage } from './organizaciones';

@NgModule({
  declarations: [
    OrganizacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(OrganizacionesPage),
  ],
  exports: [
    OrganizacionesPage
  ]
})
export class OrganizacionesPageModule { }
