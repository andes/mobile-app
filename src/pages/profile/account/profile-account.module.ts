import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileAccountPage } from './profile-account';

@NgModule({
  declarations: [
    ProfileAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileAccountPage),
  ],
  exports: [
    ProfileAccountPage
  ]
})
export class ProfileaAccountPageModule { }
