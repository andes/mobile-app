import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaboratoriosPage } from './laboratorios.page';

const routes: Routes = [
  {
    path: '',
    component: LaboratoriosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaboratoriosPageRoutingModule {}
