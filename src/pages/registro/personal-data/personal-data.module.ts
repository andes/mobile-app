import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroPersonalDataPage } from './personal-data';

@NgModule({
  declarations: [
    RegistroPersonalDataPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistroPersonalDataPage),
  ],
  exports: [
    RegistroPersonalDataPage
  ]
})
export class RegistroPersonalDataPageModule { }
