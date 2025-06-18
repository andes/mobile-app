import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { CampaniaDetallePage } from './campanias/detalle/campania-detalle';
import { AdsModule } from './../../ads/ads.module';
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
import { FeedNoticiasPage } from './feed-noticias/feed-noticias';
import { CentrosSaludPage } from './centros-salud/centros-salud';
import { CentrosSaludPrestacionesPage } from './centros-salud/centros-salud-prestaciones';
import { MapPage } from './centros-salud/map/map';
import { GoogleMapsModule } from '@angular/google-maps';
import { ListPage } from './centros-salud/list/list';
import { FaqPage } from './faq/faq';
import { ENV } from '@app/env';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { GeoProvider } from 'src/providers/library-services/geo-provider';
import { LocationsProvider } from 'src/providers/locations/locations';
import { NumerosUtilesPage } from './numeros-emergencia/numeros-utiles';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AdsModule,
        IonicModule,
        DatosUtilesPageRoutingModule,
        GoogleMapsModule
    ],
    declarations: [
        DatosUtilesPage,
        FarmaciasTurnoPage,
        CampaniasListPage,
        CampaniaDetallePage,
        FeedNoticiasPage,
        NumerosUtilesPage,
        CentrosSaludPage,
        CentrosSaludPrestacionesPage,
        MapPage,
        ListPage,
        FaqPage
    ],
    providers: [
        Geolocation,
        GeoProvider,
        LocationsProvider,
        CampaniasProvider,
        NoticiasProvider,
        InAppBrowser
    ],

})
export class DatosUtilesPageModule { }
