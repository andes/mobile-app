import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VacunasPage } from './vacunas.page';

const routes: Routes = [
  {
    path: '',
    component: VacunasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VacunasPageRoutingModule {}
