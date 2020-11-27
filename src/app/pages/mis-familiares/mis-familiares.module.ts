import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisFamiliaresPageRoutingModule } from './mis-familiares-routing.module';

import { MisFamiliaresPage } from './mis-familiares.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisFamiliaresPageRoutingModule
  ],
  declarations: [MisFamiliaresPage]
})
export class MisFamiliaresPageModule {}
