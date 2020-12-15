import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformacionValidacionPage } from './informacion-validacion/informacion-validacion';

import { RegistroPage } from './registro.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroPage
  },
  {
    path: 'informacion-validacion',
    component: InformacionValidacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroPageRoutingModule { }
