import { ENV } from '@app/env';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { LOCALE_ID } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TurnosPage } from '../pages/turnos/turnos';
import { TurnosDetallePage } from '../pages/turnos/detalles/turno-detalle';
import { EscanerDniPage } from '../pages/registro/escaner-dni/escaner-dni';
import { RegistroPersonalDataPage } from '../pages/registro/personal-data/personal-data';
import { RegistroUserDataPage } from '../pages/registro/user-data/user-data';
import { LoginPage } from '../pages/login/login';
import { NavbarPage } from '../components/navbar/navbar';
import { VerificaCodigoPage } from '../pages/registro/verifica-codigo/verifica-codigo';
import { BienvenidaPage } from '../pages/bienvenida/bienvenida';
import { WaitingValidationPage } from '../pages/registro/waiting-validation/waiting-validation';
import { ProfilePacientePage } from '../pages/profile/paciente/profile-paciente';
import { ProfileAccountPage } from '../pages/profile/account/profile-account';
import { EditorPacientePage } from '../pages/profile/editor-paciente/editor-paciente';
import { OrganizacionesPage } from '../pages/login/organizaciones/organizaciones';
import { AgendasPage } from '../pages/profesional/agendas/agendas';
import { ScanDocumentoPage } from '../pages/profesional/mpi/scan-documento/scan-documento';
import { NumerosUtilesPage } from '../pages/datos-utiles/numeros-emergencia/numeros-utiles';
import { FarmaciasTurnoPage } from '../pages/datos-utiles/farmacias-turno/farmacias-turno';
import { FeedNoticiasPage } from '../pages/datos-utiles/feed-noticias/feed-noticias';
import { VacunasPage } from '../pages/vacunas/vacunas';
import { MapPage } from '../pages/datos-utiles/centros-salud/map/map';
import { ListPage } from '../pages/datos-utiles/centros-salud/list/list';
import { CentrosSaludPage } from '../pages/datos-utiles/centros-salud/centros-salud';
import { DondeVivoDondeTrabajoPage } from '../pages/profile/paciente/donde-vivo-donde-trabajo/donde-vivo-donde-trabajo';
import { FaqPage } from '../pages/datos-utiles/faq/faq';
import { HistoriaDeSaludPage } from '../pages/historia-salud/historia-salud';
import { InformacionValidacionPage } from '../pages/registro/informacion-validacion/informacion-validacion';
import { RecuperarPasswordPage } from '../pages/registro/recuperar-password/recuperar-password';
import { DomSanitizer } from '@angular/platform-browser';
import { LaboratoriosPage } from '../pages/laboratorios/laboratorios';


import { AdsIconPage } from '../components/ads-icon/ads-icon';
import { AdsAccordionPage } from '../components/ads-accordion/ads-accordion';
import { AdsAccordionContainerPage } from '../components/ads-accordion-container/ads-accordion-container';

import { RegistroPacientePage } from '../pages/profesional/mpi/registro-paciente/registro-paciente';
import { AgendaDetallePage } from '../pages/profesional/agendas/agenda-detalle/agenda-detalle';

// Plugins
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Screenshot } from '@ionic-native/screenshot';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
// import { DatePicker } from '@ionic-native/date-picker';
// import { Sim } from '@ionic-native/sim';
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
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';

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
import { ErrorReporterProvider } from '../providers/errorReporter';
import { VacunasProvider } from '../providers/vacunas/vacunas';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
// import { Map } from "../providers/google-maps/map";
import { LocationsProvider } from '../providers/locations/locations';
import { DatePickerModule } from "ion-datepicker";
import { RupProvider } from '../providers/rup';
import { RupAdjuntarPage } from '../pages/profesional/rup-adjuntar/rup-adjuntar';
import { RupConsultorioPage } from '../pages/profesional/consultorio/rup-consultorio';
import { PacienteMPIService } from '../providers/paciente-mpi';
import { ScanParser } from '../providers/scan-parser';
import { EmailComposer } from '@ionic-native/email-composer';
import { TabViewProfilePage } from '../pages/profile/paciente/tab-view-profile';
import { ProfileContactosPage } from '../pages/profile/paciente/profile-contactos';



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
        RupAdjuntarPage,
        VacunasPage,
        DropdownAgendaItem,
        AgendaItemComponent,
        MapPage,
        ListPage,
        CentrosSaludPage,
        DondeVivoDondeTrabajoPage,
        FaqPage,
        HistoriaDeSaludPage,
        InformacionValidacionPage,
        RecuperarPasswordPage,
        RupConsultorioPage,
        AdsIconPage,
        AdsAccordionPage,
        AdsAccordionContainerPage,
        LaboratoriosPage,
        TurnosDetallePage,
        ScanDocumentoPage,
        RegistroPacientePage,
        AgendaDetallePage,
        TabViewProfilePage,
        ProfileContactosPage
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
        }),
        AgmCoreModule.forRoot({
            apiKey: ENV.MAP_KEY
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
        RupAdjuntarPage,
        VacunasPage,
        DropdownAgendaItem,
        AgendaItemComponent,
        MapPage,
        ListPage,
        CentrosSaludPage,
        DondeVivoDondeTrabajoPage,
        FaqPage,
        HistoriaDeSaludPage,
        InformacionValidacionPage,
        RecuperarPasswordPage,
        RupConsultorioPage,
        LaboratoriosPage,
        TurnosDetallePage,
        AdsAccordionContainerPage,
        ScanDocumentoPage,
        RegistroPacientePage,
        AgendaDetallePage,
        TabViewProfilePage,
        ProfileContactosPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        BarcodeScanner,
        EmailComposer,
        Screenshot,
        SQLite,
        Network,
        // Sim,
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
        RupProvider,
        FileChooser,
        FilePath,
        PacienteMPIService,
        // Map,
        LocationsProvider,
        ErrorReporterProvider,
        Geolocation,
        NativeGeocoder,
        { provide: LOCALE_ID, useValue: "es-ES" },
        Camera,
        Crop,
        ImageResizer,
        PhotoViewer,
        Base64,
        Diagnostic,
        ScanParser
    ]
})
export class AppModule { }
