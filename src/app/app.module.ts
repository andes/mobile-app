import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { LOCALE_ID } from '@angular/core';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TurnosPage } from '../pages/turnos/turnos';
import { EscanerDniPage } from '../pages/registro/escaner-dni/escaner-dni';
import { RegistroPersonalDataPage } from '../pages/registro/personal-data/personal-data';
import { RegistroUserDataPage } from '../pages/registro/user-data/user-data';
import { LoginPage } from '../pages/login/login';
import { NavbarPage } from '../pages/navbar/navbar';
import { VerificaCodigoPage } from '../pages/registro/verifica-codigo/verifica-codigo';
import { BienvenidaPage } from '../pages/bienvenida/bienvenida';
import { WaitingValidationPage } from '../pages/registro/waiting-validation/waiting-validation';
import { ProfilePacientePage } from '../pages/profile/paciente/profile-paciente';
import { ProfileAccountPage } from '../pages/profile/account/profile-account';
import { EditorPacientePage } from '../pages/profile/editor-paciente/editor-paciente';
import { OrganizacionesPage } from '../pages/organizaciones/organizaciones';
import { AgendasPage } from '../pages/profesional/agendas/agendas';
import { NumerosUtilesPage } from '../pages/datos-utiles/numeros-emergencia/numeros-utiles';
import { FarmaciasTurnoPage } from '../pages/datos-utiles/farmacias-turno/farmacias-turno';
import { FeedNoticiasPage } from '../pages/datos-utiles/feed-noticias/feed-noticias';
import { VacunasPage } from '../pages/vacunas/vacunas';
import { MapPage } from '../pages/centros-salud/map/map';
import { ListPage } from '../pages/centros-salud/list/list';
import { CentrosSaludPage } from '../pages/centros-salud/centros-salud';
import { DondeVivoDondeTrabajoPage } from '../pages/profile/paciente/donde-vivo-donde-trabajo/donde-vivo-donde-trabajo';
import { FaqPage } from '../pages/faq/faq';
import { HistoriaDeSaludPage } from '../pages/historia-salud/historia-salud';

// Plugins
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
// import { DatePicker } from '@ionic-native/date-picker';
import { Sim } from '@ionic-native/sim';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { ImageResizer } from '@ionic-native/image-resizer';
import { Base64 } from '@ionic-native/base64';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Diagnostic } from '@ionic-native/diagnostic';

// Components
import { DropdownTurnoItem } from '../components/turno-item/dropdown-turno-item';
import { TurnoItemComponent } from '../components/turno-item/turno-item';
import { AgendaItemComponent } from '../components/agenda-item/agenda-item';
import { DropdownAgendaItem } from '../components/agenda-item/dropdown-agenda-item';

// Providers
import { AuthProvider } from '../providers/auth/auth';
import { NetworkProvider } from './../providers/network';
import { TurnosProvider } from '../providers/turnos';
import { DeviceProvider } from '../providers/auth/device';
import { ToastProvider } from '../providers/toast';
import { PacienteProvider } from '../providers/paciente';
import { ConstanteProvider } from '../providers/constantes';
import { AgendasProvider } from '../providers/agendas';
import { FarmaciasProvider } from '../providers/farmacias';

import { VacunasProvider } from '../providers/vacunas/vacunas';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
// import { Map } from "../providers/google-maps/map";
import { LocationsProvider } from '../providers/locations/locations';
import { DatePickerModule } from "ion-datepicker";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TurnosPage,
    EscanerDniPage,
    RegistroPersonalDataPage,
    RegistroUserDataPage,
    LoginPage,
    NavbarPage,
    VerificaCodigoPage,
    BienvenidaPage,
    WaitingValidationPage,
    TurnoItemComponent,
    DropdownTurnoItem,
    ProfilePacientePage,
    ProfileAccountPage,
    EditorPacientePage,
    OrganizacionesPage,
    AgendasPage,
    NumerosUtilesPage,
    FarmaciasTurnoPage,
    FeedNoticiasPage,
    VacunasPage,
    DropdownAgendaItem,
    AgendaItemComponent,
    MapPage,
    ListPage,
    CentrosSaludPage,
    DondeVivoDondeTrabajoPage,
    FaqPage,
    HistoriaDeSaludPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    DatePickerModule,
    IonicStorageModule.forRoot({
      name: 'andes',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TurnosPage,
    EscanerDniPage,
    RegistroPersonalDataPage,
    RegistroUserDataPage,
    LoginPage,
    NavbarPage,
    VerificaCodigoPage,
    BienvenidaPage,
    WaitingValidationPage,
    TurnoItemComponent,
    DropdownTurnoItem,
    ProfilePacientePage,
    ProfileAccountPage,
    EditorPacientePage,
    OrganizacionesPage,
    FeedNoticiasPage,
    AgendasPage,
    NumerosUtilesPage,
    FarmaciasTurnoPage,
    VacunasPage,
    DropdownAgendaItem,
    AgendaItemComponent,
    MapPage,
    ListPage,
    CentrosSaludPage,
    DondeVivoDondeTrabajoPage,
    FaqPage,
    HistoriaDeSaludPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    SQLite,
    Network,
    Sim,
    Device,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    TurnosProvider,
    DeviceProvider,
    ToastProvider,
    PacienteProvider,
    ConstanteProvider,
    NetworkProvider,
    AgendasProvider,
    FarmaciasProvider,
    VacunasProvider,
    ConnectivityProvider,
    GoogleMapsProvider,
    // Map,
    LocationsProvider,
    Geolocation,
    NativeGeocoder,
    { provide: LOCALE_ID, useValue: "es-ES" },
    Camera,
    Crop,
    ImageResizer,
    PhotoViewer,
    Base64,
    Diagnostic
  ]
})
export class AppModule { }
