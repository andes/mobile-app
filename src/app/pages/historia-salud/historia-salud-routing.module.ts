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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoriaSaludPageRoutingModule {}
