import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisFamiliaresPage } from './mis-familiares.page';

const routes: Routes = [
  {
    path: '',
    component: MisFamiliaresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisFamiliaresPageRoutingModule {}
