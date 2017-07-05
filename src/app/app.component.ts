import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage'
import { AuthProvider } from '../providers/auth/auth';
import { HomePage } from '../pages/home/home';
import { TurnosPage } from '../pages/turnos/turnos';
import { EscanerDniPage } from '../pages/escaner-dni/escaner-dni';
import { RegistroPersonalDataPage } from '../pages/registro/personal-data/personal-data';
import { LoginPage } from '../pages/login/login';
import { UsuariosPage } from '../pages/usuarios/usuarios';
import { DatabaseProvider } from '../providers/database/database';
import { DeviceProvider } from '../providers/auth/device';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;

  pages: Array<{ title: string, component: any }>;

  constructor(public deviceProvider: DeviceProvider, public authProvider: AuthProvider, public storage: Storage, public database: DatabaseProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public sqlite: SQLite) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Login', component: LoginPage },
      { title: 'Registro', component: RegistroPersonalDataPage },
      { title: 'Escaneo DNI', component: EscanerDniPage },
      { title: 'Turnos', component: TurnosPage },
      { title: 'Usuarios', component: UsuariosPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.deviceProvider.init();

      this.authProvider.checkAuth().then(() => {
        this.rootPage = TurnosPage;
        this.deviceProvider.update().then(() => true, () => true);
      }).catch(() => {
        this.rootPage = HomePage;
      });


    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
