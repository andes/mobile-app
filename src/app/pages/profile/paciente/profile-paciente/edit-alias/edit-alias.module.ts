import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAliasPageRoutingModule } from './edit-alias-routing.module';

import { EditAliasPage } from './edit-alias.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EditAliasPageRoutingModule
    ],
    declarations: [EditAliasPage]
})
export class EditAliasPageModule { }
