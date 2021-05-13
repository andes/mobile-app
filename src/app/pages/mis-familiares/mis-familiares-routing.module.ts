import { RegistroFamiliarPage } from './registro-familiar';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisFamiliaresPage } from './mis-familiares.page';

const routes: Routes = [
    {
        path: '',
        component: MisFamiliaresPage
    },
    {
        path: 'registro-familiar',
        component: RegistroFamiliarPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MisFamiliaresPageRoutingModule { }
