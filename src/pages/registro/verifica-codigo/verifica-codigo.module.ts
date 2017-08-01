import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerificaCodigoPage } from './verifica-codigo';

@NgModule({
  declarations: [
    VerificaCodigoPage,
  ],
  imports: [
    IonicPageModule.forChild(VerificaCodigoPage),
  ],
  exports: [
    VerificaCodigoPage
  ]
})
export class VerificaCodigoPageModule { }
