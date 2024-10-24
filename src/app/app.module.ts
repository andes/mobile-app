import { StorageService } from 'src/providers/storage-provider.service';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { DatosUtilesPageModule } from './pages/datos-utiles/datos-utiles.module';
import { TurnosPageModule } from './pages/turnos/turnos.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonInfiniteScroll, NavParams } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthProvider } from 'src/providers/auth/auth';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NetworkProvider } from 'src/providers/network';
import { ToastProvider } from 'src/providers/toast';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { TablasMaestras } from 'src/providers/tablas-maestras';
import { DeviceProvider } from 'src/providers/auth/device';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ErrorReporterProvider } from 'src/providers/library-services/errorReporter';
import { GeoProvider } from 'src/providers/library-services/geo-provider';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { LocationsProvider } from 'src/providers/locations/locations';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { PacienteProvider } from 'src/providers/paciente';
import { FarmaciasProvider } from 'src/providers/farmacias';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ScanParser } from 'src/providers/scan-parser';
import { FormBuilder } from '@angular/forms';
import { ConstanteProvider } from 'src/providers/constantes';
import { RupProvider } from 'src/providers/rup';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ConnectivityService } from './providers/connectivity.service';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { AdsModule } from './ads/ads.module';
import { ProfesionalProvider } from 'src/providers/profesional';

import { LOCALE_ID } from '@angular/core';
import localeSpanish from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import * as moment from 'moment';
import { HttpClientModule } from '@angular/common/http';
import { VacunasPageModule } from './pages/vacunas/vacunas.module';
import { HttpModule } from '@angular/http';
import { DescargaArchivosProvider } from 'src/providers/library-services/descarga-archivos';
import { FirebaseMessaging } from '@awesome-cordova-plugins/firebase-messaging/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
registerLocaleData(localeSpanish, 'es');
moment.locale('es');

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot(),
        // tslint:disable-next-line: deprecation
        HttpModule,
        HttpClientModule,
        TurnosPageModule,
        DatosUtilesPageModule,
        AdsModule,
        VacunasPageModule
    ],
    providers: [
        AuthProvider,
        BarcodeScanner,
        ScanParser,
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
        IonInfiniteScroll,
        Geolocation,
        GeoProvider,
        IonicStorageModule,
        LocationsProvider,
        NavParams,
        Network,
        NetworkProvider,
        PacienteProvider,
        SplashScreen,
        StatusBar,
        TablasMaestras,
        ToastProvider,
        RupProvider,
        SQLite,
        PhotoViewer,
        DescargaArchivosProvider,
        ProfesionalProvider,
        FirebaseMessaging,
        HTTP,
        StorageService,
        CallNumber,
        { provide: LOCALE_ID, useValue: 'es' },
    ],
    bootstrap: [AppComponent],

})
export class AppModule { }
