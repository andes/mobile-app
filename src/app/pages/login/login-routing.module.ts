import { InformacionValidacionPage } from './informacion-validacion/informacion-validacion';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisclaimerPage } from './disclaimers/accept-disclaimer';

import { LoginPage } from './login.page';
import { OrganizacionesPage } from './organizaciones/organizaciones';
import { RecuperarPasswordPage } from './recuperar-password/recuperar-password';
import { LoginProfesionalPage } from './loginProfesional.page';
import { RecuperarPassProfesionalPage } from './recuperar-password/recuperar-pass-profesional';

const routes: Routes = [
    {
        path: '',
        component: LoginPage
    },
    {
        path: 'profesional',
        component: LoginProfesionalPage
    },
    {
        path: 'disclaimer',
        component: DisclaimerPage
    },
    {
        path: 'organizaciones',
        component: OrganizacionesPage
    },
    {
        path: 'informacion-validacion',
        component: InformacionValidacionPage
    },
    {
        path: 'recuperar-password',
        component: RecuperarPasswordPage
    },
    {
        path: 'recuperar-password-profesional',
        component: RecuperarPassProfesionalPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LoginPageRoutingModule { }
