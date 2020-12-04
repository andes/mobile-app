import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ProfilePacientePage } from './paciente/profile-paciente';
import { TabViewProfilePage } from './paciente/tab-view-profile';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage, ProfilePacientePage, TabViewProfilePage]
})
export class ProfilePageModule {}
