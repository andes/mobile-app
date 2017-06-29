import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaitingValidationPage } from './waiting-validation';

@NgModule({
  declarations: [
    WaitingValidationPage,
  ],
  imports: [
    IonicPageModule.forChild(WaitingValidationPage),
  ],
  exports: [
    WaitingValidationPage
  ]
})
export class WaitingValidationPageModule { }
