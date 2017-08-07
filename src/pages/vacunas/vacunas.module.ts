import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VacunasPage } from './vacunas';

@NgModule({
  declarations: [
    VacunasPage,
  ],
  imports: [
    IonicPageModule.forChild(VacunasPage),
  ],
  exports: [
    VacunasPage
  ]
})
export class VacunasPageModule {}
