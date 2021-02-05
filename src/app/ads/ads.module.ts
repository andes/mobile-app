import { IonicStorageModule } from '@ionic/storage';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsIconPage } from './ads-icon/ads-icon';
import { AdsAccordionContainerPage } from 'src/components/ads-accordion-container/ads-accordion-container';
import { AdsAccordionPage } from 'src/components/ads-accordion/ads-accordion';

@NgModule({
    declarations: [
        AdsIconPage,
        AdsAccordionPage,
        AdsAccordionContainerPage,

    ],
    imports: [
        IonicStorageModule.forRoot(),
        CommonModule,
    ],
    exports: [
        AdsIconPage,
        AdsAccordionPage,
        AdsAccordionContainerPage
    ],
    providers: [
        IonicStorageModule,
    ]
})

export class AdsModule { }
