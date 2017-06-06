import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NavbarPage } from './navbar';

@NgModule({
  declarations: [
    NavbarPage,
  ],
  imports: [
    IonicPageModule.forChild(NavbarPage),
  ],
  exports: [
    NavbarPage
  ]
})
export class NavbarPageModule {}
