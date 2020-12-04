import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorPacientePage } from './editor-paciente/editor-paciente';
import { ProfilePacientePage } from './paciente/profile-paciente';
import { TabViewProfilePage } from './paciente/tab-view-profile';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'editor-paciente',
    component: EditorPacientePage
  },
  {
    path: 'view-profile',
    component: TabViewProfilePage
  },
  {
    path: 'view-profile/profile-paciente',
    component: ProfilePacientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
