import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ProfilePacientePage } from './paciente/profile-paciente/profile-paciente';
import { TabViewProfilePage } from './paciente/tab-view-profile';
import { DondeVivoDondeTrabajoPage } from './paciente/donde-vivo-donde-trabajo/donde-vivo-donde-trabajo';
import { ProfileContactoPage } from './paciente/contacto/profile-contacto';
import { AdsIconPage } from 'src/components/ads-icon/ads-icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule
  ],
  declarations: [
    AdsIconPage,
    ProfilePage,
    ProfilePacientePage,
    TabViewProfilePage,
    DondeVivoDondeTrabajoPage,
    ProfileContactoPage]
})
export class ProfilePageModule { }
