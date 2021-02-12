import { RegistroUserDataPage } from './user-data/user-data';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroPage } from './registro.page';

const routes: Routes = [
    {
        path: '',
        component: RegistroPage
    },
    {
        path: 'user-data',
        component: RegistroUserDataPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RegistroPageRoutingModule { }
