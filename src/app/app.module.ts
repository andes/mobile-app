import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TurnosPage } from '../pages/turnos/turnos';
import { EscanerDniPage } from '../pages/escaner-dni/escaner-dni';
import { RegistroPage } from '../pages/registro/registro';
import { LoginPage } from '../pages/login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';

import { TipoPrestacionServiceProvider } from '../providers/tipo-prestacion-service/tipo-prestacion-service';
import { DatabaseProvider } from '../providers/database/database';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TurnosPage,
    EscanerDniPage,
    RegistroPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
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
    RegistroPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    SQLite,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    TipoPrestacionServiceProvider,
    DatabaseProvider
  ]
})
export class AppModule { }
