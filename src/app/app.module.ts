import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TurnosPage } from '../pages/turnos/turnos';
import { EscanerDniPage } from '../pages/escaner-dni/escaner-dni';
import { RegistroPersonalDataPage } from '../pages/registro/personal-data/personal-data';
import { RegistroUserDataPage } from '../pages/registro/user-data/user-data';
import { LoginPage } from '../pages/login/login';
import { NavbarPage } from '../pages/navbar/navbar';
import { UsuariosPage } from '../pages/usuarios/usuarios';
import { VerificaCodigoPage } from '../pages/verifica-codigo/verifica-codigo';
import { BienvenidaPage } from '../pages/bienvenida/bienvenida';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';
import { DatePicker } from '@ionic-native/date-picker';
import { Sim } from '@ionic-native/sim';

import { TipoPrestacionServiceProvider } from '../providers/tipo-prestacion-service/tipo-prestacion-service';
import { DatabaseProvider } from '../providers/database/database';
import { AuthProvider } from '../providers/auth/auth';
import { UsuariosProvider } from '../providers/usuarios/usuarios';

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
    UsuariosPage,
    VerificaCodigoPage,
    BienvenidaPage
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
    UsuariosPage,
    VerificaCodigoPage,
    BienvenidaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    SQLite,
    DatePicker,
    Sim,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    TipoPrestacionServiceProvider,
    DatabaseProvider,
    AuthProvider,
    UsuariosProvider
  ]
})
export class AppModule { }
