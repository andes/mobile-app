import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavParams } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home-page';
import { HomePageRoutingModule } from './home-routing.module';
import { NavbarPage } from 'src/components/navbar/navbar';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, NavbarPage]
})
export class HomePageModule {}
