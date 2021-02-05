import { AdsModule } from './../ads/ads.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavParams } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home-page';
import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        AdsModule
    ],
    declarations: [HomePage]
})
export class HomePageModule { }
