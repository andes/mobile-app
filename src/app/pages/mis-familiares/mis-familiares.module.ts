import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MisFamiliaresPageRoutingModule } from './mis-familiares-routing.module';
import { MisFamiliaresPage } from './mis-familiares.page';
import { RegistroFamiliarPage } from './registro-familiar';
import { AdsModule } from 'src/app/ads/ads.module';
import { BarcodeScannerService } from 'src/providers/library-services/barcode-scanner.service';
import { ScanParser } from 'src/providers/scan-parser';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        MisFamiliaresPageRoutingModule,
        AdsModule
    ],
    declarations: [MisFamiliaresPage,
                   RegistroFamiliarPage],
    providers: [
        BarcodeScannerService,
        ScanParser
    ]
})
export class MisFamiliaresPageModule { }
