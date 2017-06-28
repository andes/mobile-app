import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroUserDataPage } from './user-data';

@NgModule({
  declarations: [
    RegistroUserDataPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistroUserDataPage),
  ],
  exports: [
    RegistroUserDataPage
  ]
})
export class RegistroPageModule { }
