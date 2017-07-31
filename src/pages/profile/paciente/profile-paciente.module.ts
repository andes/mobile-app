import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePacientePage } from './profile-paciente';

@NgModule({
  declarations: [
    ProfilePacientePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePacientePage),
  ],
  exports: [
    ProfilePacientePage
  ]
})
export class ProfilePacientePageModule { }
