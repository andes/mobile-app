import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaboratoriosPageRoutingModule } from './laboratorios-routing.module';

import { LaboratoriosPage } from './laboratorios.page';
import { AdsModule } from './../../ads/ads.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaboratoriosPageRoutingModule,
    AdsModule
  ],
  declarations: [LaboratoriosPage],

})
export class LaboratoriosPageModule { }
