import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAliasPage } from './edit-alias.page';

const routes: Routes = [
  {
    path: '',
    component: EditAliasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAliasPageRoutingModule {}
