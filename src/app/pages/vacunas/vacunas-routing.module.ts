import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VacunasDetallePage } from './vacunas-detalle.page';
import { VacunasPage } from './vacunas.page';

const routes: Routes = [
    {
        path: '',
        component: VacunasPage
    },
    {
        path: 'vacunas-detalle',
        component: VacunasDetallePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VacunasPageRoutingModule { }
