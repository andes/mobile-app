import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorPacientePage } from './editor-paciente/editor-paciente';
import { ProfileContactoPage } from './paciente/contacto/profile-contacto';
import { DondeVivoDondeTrabajoPage } from './paciente/donde-vivo-donde-trabajo/donde-vivo-donde-trabajo';
import { ProfilePacientePage } from './paciente/profile-paciente/profile-paciente';
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
    component: TabViewProfilePage,
    children: [
      {
        path: 'profile-paciente',
        component: ProfilePacientePage
      },
      {
        path: 'direccion',
      component: DondeVivoDondeTrabajoPage
      },
      {
        path: 'contacto',
        component: ProfileContactoPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
