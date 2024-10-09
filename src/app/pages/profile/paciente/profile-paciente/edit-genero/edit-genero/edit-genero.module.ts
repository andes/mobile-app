import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditGeneroPageRoutingModule } from './edit-genero-routing.module';

import { EditGeneroPage } from './edit-genero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditGeneroPageRoutingModule
  ],
  declarations: [EditGeneroPage]
})
export class EditGeneroPageModule {}
