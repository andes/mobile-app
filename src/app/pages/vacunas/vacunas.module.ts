import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VacunasPageRoutingModule } from './vacunas-routing.module';
import { VacunasPage } from './vacunas.page';
import { VacunasProvider } from 'src/providers/vacunas/vacunas';
import { AdsModule } from './../../ads/ads.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        VacunasPageRoutingModule,
        AdsModule
    ],
    declarations: [VacunasPage],
    providers: [VacunasProvider]
})
export class VacunasPageModule { }
