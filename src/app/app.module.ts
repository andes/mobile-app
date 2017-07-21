import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

// Pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TurnosPage } from '../pages/turnos/turnos';
import { EscanerDniPage } from '../pages/escaner-dni/escaner-dni';
import { RegistroPersonalDataPage } from '../pages/registro/personal-data/personal-data';
import { RegistroUserDataPage } from '../pages/registro/user-data/user-data';
import { LoginPage } from '../pages/login/login';
import { NavbarPage } from '../pages/navbar/navbar';
import { VerificaCodigoPage } from '../pages/verifica-codigo/verifica-codigo';
import { BienvenidaPage } from '../pages/bienvenida/bienvenida';
import { WaitingValidationPage } from '../pages/registro/waiting-validation/waiting-validation';
import { ProfilePacientePage } from '../pages/profile/paciente/profile-paciente';
import { ProfileAccountPage } from '../pages/profile/account/profile-account';
import { EditorPacientePage } from '../pages/profile/editor-paciente/editor-paciente';
import { OrganizacionesPage } from '../pages/organizaciones/organizaciones';
import { AgendasPage } from '../pages/profesional/agendas/agendas';

// Plugins
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { DatePicker } from '@ionic-native/date-picker';
import { Sim } from '@ionic-native/sim';
import { Device } from '@ionic-native/device';
import { DropdownTurnoItem } from '../components/turno-item/dropdown-turno-item';

// Providers
import { DatabaseProvider } from '../providers/database/database';
import { AuthProvider } from '../providers/auth/auth';
import { TurnosProvider } from '../providers/turnos';
import { DeviceProvider } from '../providers/auth/device';
import { TurnoItemComponent } from '../components/turno-item/turno-item';
import { ToastProvider } from '../providers/toast';
import { PacienteProvider } from '../providers/paciente';
import { ConstanteProvider } from '../providers/constantes';

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
    AgendasPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
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
    AgendasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    SQLite,
    DatePicker,
    Sim,
    Device,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DatabaseProvider,
    AuthProvider,
    TurnosProvider,
    DeviceProvider,
    ToastProvider,
    PacienteProvider,
    ConstanteProvider
  ]
})
export class AppModule { }
