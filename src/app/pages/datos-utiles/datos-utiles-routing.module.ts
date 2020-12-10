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
import { MapPage } from './centros-salud/map/map';
import { ListPage } from './centros-salud/list/list';

const routes: Routes = [
  {
    path: '',
    component: DatosUtilesPage
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
  {
    path: 'centros',
    component: CentrosSaludPage,
    children: [
      {
        path: '',
        component: MapPage
      },
      {
        path: 'mapa',
        component: MapPage
      },
      {
        path: 'lista-cercanos',
        component: ListPage
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosUtilesPageRoutingModule { }
