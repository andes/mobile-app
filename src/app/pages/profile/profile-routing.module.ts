import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileContactoPage } from './paciente/contacto/profile-contacto';
import { DondeVivoDondeTrabajoPage } from './paciente/donde-vivo-donde-trabajo/donde-vivo-donde-trabajo';
import { ProfilePacientePage } from './paciente/profile-paciente/profile-paciente';
import { TabViewProfilePage } from './paciente/tab-view-profile';
import { ProfilePage } from './profile.page';
import { ProfileAccountPage } from './account/profile-account';

const routes: Routes = [
    {
        path: '',
        component: ProfilePage
    },
    {
        path: 'view-profile',
        component: TabViewProfilePage,
        children: [
            {
                path: '',
                component: ProfilePacientePage
            },
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
    },
    {
        path: 'account',
        component: ProfileAccountPage
    },
    {
        path: 'edit-genero',
        loadChildren: () => import('./paciente/profile-paciente/edit-genero/edit-genero/edit-genero.module').then(m => m.EditGeneroPageModule)
    },
    {
        path: 'edit-alias',
        loadChildren: () => import('./paciente/profile-paciente/edit-alias/edit-alias.module').then(m => m.EditAliasPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfilePageRoutingModule { }
