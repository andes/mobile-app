import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SelectorSexoComponent } from './selector-sexo';

@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    declarations: [SelectorSexoComponent],
    exports: [SelectorSexoComponent]
})
export class SelectorSexoModule { }
