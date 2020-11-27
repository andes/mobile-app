import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaniasListPage } from './campanias/campanias-list';
import { CampaniaDetallePage } from './campanias/detalle/campania-detalle';
import { CentrosSaludPage } from './centros-salud/centros-salud';

import { DatosUtilesPage } from './datos-utiles.page';
import { FarmaciasTurnoPage } from './farmacias-turno/farmacias-turno';
import { FeedNoticiasPage } from './feed-noticias/feed-noticias';
import { NumerosUtilesPage } from './numeros-emergencia/numeros-utiles';

const routes: Routes = [
  {
    path: '',
    component: DatosUtilesPage
  },
  { path: 'centros',
    component: CentrosSaludPage
  },
  { path: 'numeros',
    component: NumerosUtilesPage
  },
  { path: 'farmacias',
    component: FarmaciasTurnoPage
  },
  { path: 'campanias',
    component: CampaniasListPage
  },
  { path: 'noticias',
    component: FeedNoticiasPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosUtilesPageRoutingModule {}
