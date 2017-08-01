import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EscanerDniPage } from './escaner-dni';

@NgModule({
  declarations: [
    EscanerDniPage,
  ],
  imports: [
    IonicPageModule.forChild(EscanerDniPage),
  ],
  exports: [
    EscanerDniPage
  ]
})
export class EscanerDniPageModule {}
