import { AdsAccordionContainerPage } from 'src/components/ads-accordion-container/ads-accordion-container';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { AgmCoreModule } from '@agm/core';
import { ENV } from '@app/env';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeoProvider } from 'src/providers/geo-provider';
import { LocationsProvider } from 'src/providers/locations/locations';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosUtilesPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: ENV.MAP_KEY
    })
  ],
  declarations: [
    DatosUtilesPage,
    FarmaciasTurnoPage,
    CampaniasListPage,
    PuntoSaludablePage,
    FeedNoticiasPage,
    CentrosSaludPage,
    MapPage,
    ListPage,
  ],
  providers: [
    Geolocation,
    GeoProvider,
    LocationsProvider,
    CampaniasProvider,
    NoticiasProvider
  ],
})
export class DatosUtilesPageModule { }
