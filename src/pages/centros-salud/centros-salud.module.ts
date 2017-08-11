import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CentrosSaludPage } from './centros-salud';

@NgModule({
  declarations: [
    CentrosSaludPage,
  ],
  imports: [
    IonicPageModule.forChild(CentrosSaludPage),
  ],
  exports: [
    CentrosSaludPage
  ]
})
export class CentrosSaludPageModule {}
