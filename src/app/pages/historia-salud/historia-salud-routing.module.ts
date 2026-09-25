import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleCategoriaPage } from './categorias/detalle-categoria';
import { RecetasPage } from './recetas/recetas';
import { DetalleRecetaPage } from './recetas/detalle-receta/detalle-receta';
import { HistoriaSaludPage } from './historia-salud.page';
import { HudsAccesosInfoPage } from './huds-accesos-info/huds-accesos-info';
import { HudsAccesosListPage } from './huds-accesos-list/huds-accesos-list';

const routes: Routes = [
    {
        path: '',
        component: HistoriaSaludPage,
    },
    {
        path: 'detalle',
        component: DetalleCategoriaPage,
    },
    {
        path: 'recetas',
        component: RecetasPage,
    },
    {
        path: 'detalle-receta',
        component: DetalleRecetaPage,
    },
    {
        path: 'huds-accesos-info',
        component: HudsAccesosInfoPage,
    },
    {
        path: 'huds-accesos-list',
        component: HudsAccesosListPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HistoriaSaludPageRoutingModule {}
