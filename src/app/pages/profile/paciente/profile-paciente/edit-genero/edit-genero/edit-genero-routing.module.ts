import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditGeneroPage } from './edit-genero.page';

const routes: Routes = [
    {
        path: '',
        component: EditGeneroPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EditGeneroPageRoutingModule { }
