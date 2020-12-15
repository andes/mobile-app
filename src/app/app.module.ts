import { DatosUtilesPageModule } from './pages/datos-utiles/datos-utiles.module';
import { TurnosPageModule } from './pages/turnos/turnos.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthProvider } from 'src/providers/auth/auth';
import { IonicStorageModule } from '@ionic/storage';
import { NetworkProvider } from 'src/providers/network';
import { HttpModule } from '@angular/http';
import { ToastProvider } from 'src/providers/toast';
import { Network } from '@ionic-native/network/ngx';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { TablasMaestras } from 'src/providers/tablas-maestras';
import { DeviceProvider } from 'src/providers/auth/device';
import { Device } from '@ionic-native/device/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ErrorReporterProvider } from 'src/providers/errorReporter';
import { GeoProvider } from 'src/providers/geo-provider';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { LocationsProvider } from 'src/providers/locations/locations';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { PacienteProvider } from 'src/providers/paciente';
import { FarmaciasProvider } from 'src/providers/farmacias';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FormBuilder } from '@angular/forms';
import { ConstanteProvider } from 'src/providers/constantes';
import { RupProvider } from 'src/providers/rup';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { ConnectivityService } from './providers/connectivity.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AdsIconPage } from './../components/ads-icon/ads-icon';

import { LOCALE_ID } from '@angular/core';
import localeSpanish from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import * as moment from 'moment';
import { HttpClientModule } from '@angular/common/http';
registerLocaleData(localeSpanish, 'es');
moment.locale('es');

@NgModule({
  declarations: [
    AppComponent,
    AdsIconPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpModule,
    HttpClientModule,
    TurnosPageModule,
    DatosUtilesPageModule
  ],
  providers: [
    AdsIconPage,
    AuthProvider,
    BarcodeScanner,
    DatosGestionProvider,
    CheckerGpsProvider,
    ConnectivityService,
    ConstanteProvider,
    Device,
    DeviceProvider,
    Diagnostic,
    EmailComposer,
    ErrorReporterProvider,
    FarmaciasProvider,
    FormBuilder,
    Geolocation,
    GeoProvider,
    IonicStorageModule,
    LocationsProvider,
    NavParams,
    Network,
    NetworkProvider,
    PacienteProvider,
    Screenshot,
    SplashScreen,
    StatusBar,
    TablasMaestras,
    ToastProvider,
    RupProvider,
    SQLite,
    PhotoViewer,
    { provide: LOCALE_ID, useValue: 'es' },
    // { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
