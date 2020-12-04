import { PuntoSaludablePage } from './punto-saludable/punto-saludable';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaniasListPage } from './campanias/campanias-list';
import { CentrosSaludPage } from './centros-salud/centros-salud';

import { DatosUtilesPage } from './datos-utiles.page';
import { FarmaciasTurnoPage } from './farmacias-turno/farmacias-turno';
import { FeedNoticiasPage } from './feed-noticias/feed-noticias';
import { NumerosUtilesPage } from './numeros-emergencia/numeros-utiles';
import { FaqPage } from './faq/faq';

const routes: Routes = [
  {
    path: '',
    component: DatosUtilesPage
  },
  {
    path: 'centros',
    component: CentrosSaludPage
  },
  {
    path: 'numeros',
    component: NumerosUtilesPage
  },
  {
    path: 'farmacias',
    component: FarmaciasTurnoPage
  },
  {
    path: 'campanias',
    component: CampaniasListPage
  },
  {
    path: 'noticias',
    component: FeedNoticiasPage
  },
  {
    path: 'punto-saludable',
    component: PuntoSaludablePage
  },
  {
    path: 'faq',
    component: FaqPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosUtilesPageRoutingModule { }
