import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosUtilesPageRoutingModule } from './datos-utiles-routing.module';

import { DatosUtilesPage } from './datos-utiles.page';
import { FarmaciasTurnoPage } from './farmacias-turno/farmacias-turno';
import { CampaniasProvider } from 'src/providers/campanias';
import { CampaniasListPage } from './campanias/campanias-list';
import { NoticiasProvider } from 'src/providers/noticias';
import { PuntoSaludablePage } from './punto-saludable/punto-saludable';
import { FeedNoticiasPage } from './feed-noticias/feed-noticias';
import { AdsAccordionPage } from 'src/components/ads-accordion/ads-accordion';
import { CentrosSaludPage } from './centros-salud/centros-salud';
import { MapPage } from './centros-salud/map/map';
import { ListPage } from './centros-salud/list/list';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosUtilesPageRoutingModule
  ],
  declarations: [
    DatosUtilesPage,
    FarmaciasTurnoPage,
    CampaniasListPage,
    PuntoSaludablePage,
    FeedNoticiasPage,
    AdsAccordionPage,
    CentrosSaludPage,
    MapPage,
    ListPage
  ],
  providers: [
    CampaniasProvider,
    NoticiasProvider
  ]
})
export class DatosUtilesPageModule { }
