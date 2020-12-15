import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaboratoriosPageRoutingModule } from './laboratorios-routing.module';

import { LaboratoriosPage } from './laboratorios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaboratoriosPageRoutingModule
  ],
  declarations: [LaboratoriosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LaboratoriosPageModule { }
