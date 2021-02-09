import { AccesosMiHUDSPage } from './accesos-mi-huds/accesos-mi-huds';
import { DetalleAccesoMiHUDSPage } from './accesos-mi-huds/detalle-acceso-mi-huds';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleCategoriaPage } from './categorias/detalle-categoria';

import { HistoriaSaludPage } from './historia-salud.page';

const routes: Routes = [
  {
    path: '',
    component: HistoriaSaludPage
  },
  {
    path: 'detalle',
    component: DetalleCategoriaPage
  },
  {
    path: 'accesos-mi-huds',
    component: AccesosMiHUDSPage,
  },
  {
    path: 'detalle-huds',
    component: DetalleAccesoMiHUDSPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoriaSaludPageRoutingModule { }
