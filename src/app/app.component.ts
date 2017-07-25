import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Providers
import { AuthProvider } from '../providers/auth/auth';
import { DeviceProvider } from '../providers/auth/device';

// Pages
import { HomePage } from '../pages/home/home';
import { TurnosPage } from '../pages/turnos/turnos';
import { AgendasPage } from '../pages/profesional/agendas/agendas';
import { ProfilePacientePage } from '../pages/profile/paciente/profile-paciente';
import { ProfileAccountPage } from '../pages/profile/account/profile-account';

import config from '../config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;
  // used for an example of ngFor and navigation
  pacienteMenu = [
    { title: 'Turnos', component: TurnosPage },
    { title: 'Datos personales', component: ProfilePacientePage },
    { title: 'Configurar cuenta', component: ProfileAccountPage },
    { title: 'Cerrar sessión', action: 'logout' },
  ];

  profesionalMenu = [
    { title: 'Agendas programadas', component: AgendasPage },
    { title: 'Cerrar sessión', action: 'logout' },
  ];


  constructor(
    public deviceProvider: DeviceProvider,
    public authProvider: AuthProvider,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen) {
    console.log("asd");
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.deviceProvider.init();

      if (config.REMEMBER_SESSION) {
        this.authProvider.checkAuth().then((user: any) => {
          if (!user.profesionalId) {
            this.rootPage = TurnosPage;
          } else {
            this.rootPage = AgendasPage;
          }

          this.deviceProvider.update().then(() => true, () => true);
        }).catch(() => {
          this.rootPage = HomePage;
        });
      } else {
        this.rootPage = HomePage;
      }

      if ((window as any).cordova && (window as any).cordova.plugins.Keyboard) {
        (window as any).cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        (window as any).cordova.plugins.Keyboard.disableScroll(true);
      }
    });
  }

  getMenu() {
    if (this.authProvider.user) {
      return this.authProvider.user.profesionalId ? this.profesionalMenu : this.pacienteMenu;
    } else {
      return [];
    }
  }

  logout() {
    this.deviceProvider.remove().then(() => true, () => true);
    this.authProvider.logout();
    this.nav.setRoot(HomePage);
  }

  menuClick(page) {
    if (page.component) {
      this.nav.setRoot(page.component);
    } else {
      switch (page.action) {
        case 'logout':
          this.logout();
          break;
      }
    }
  }
}
