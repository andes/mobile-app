import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformacionValidacionPage } from './informacion-validacion/informacion-validacion';
import { RecuperarPasswordPage } from './recuperar-password/recuperar-password';

import { RegistroPage } from './registro.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroPage
  },
  {
    path: 'informacion-validacion',
    component: InformacionValidacionPage
  },
  {
    path: 'recuperar-password',
    component: RecuperarPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroPageRoutingModule {}
