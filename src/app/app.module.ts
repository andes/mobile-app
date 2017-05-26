import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TurnosPage } from '../pages/turnos/turnos';
import { EscanerDniPage } from '../pages/escaner-dni/escaner-dni';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TipoPrestacionServiceProvider } from '../providers/tipo-prestacion-service/tipo-prestacion-service';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TurnosPage,
    EscanerDniPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TurnosPage,
    EscanerDniPage
  ],
  providers: [
    StatusBar,
    SplashScreen,   
    BarcodeScanner,     
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TipoPrestacionServiceProvider
  ]
})
export class AppModule {}
