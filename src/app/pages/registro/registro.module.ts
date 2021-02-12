import { RegistroUserDataPage } from './user-data/user-data';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';

import { RegistroPage } from './registro.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RegistroPageRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [RegistroPage, RegistroUserDataPage]
})
export class RegistroPageModule { }
