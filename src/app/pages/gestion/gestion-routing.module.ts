import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionPage } from './gestion.page';

const routes: Routes = [
    {
        path: '',
        component: GestionPage
    },
    {
        path: 'popover',
        loadChildren: () => import('./popover/popover.module').then( m => m.PopoverPageModule)
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
})
export class GestionPageRoutingModule {}
