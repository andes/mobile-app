import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

// Providers
import { NetworkProvider } from './../providers/network';
import { AuthProvider } from '../providers/auth/auth';
import { DeviceProvider } from '../providers/auth/device';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';
import { GoogleMapsProvider } from './../providers/google-maps/google-maps';

// Pages
import { HomePage } from '../pages/home/home';
import { ProfilePacientePage } from '../pages/profile/paciente/profile-paciente';
import { ProfileAccountPage } from '../pages/profile/account/profile-account';
import { FaqPage } from '../pages/datos-utiles/faq/faq';

import * as moment from 'moment';

import config from '../config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;
  pacienteMenu = [
    // { title: 'Turnos', component: TurnosPage },
    { title: 'Datos personales', component: ProfilePacientePage },
    { title: 'Configurar cuenta', component: ProfileAccountPage },
    // { title: 'Mis Vacunas', component: VacunasPage },
    { title: 'Preguntas frecuentes', component: FaqPage },
    { title: 'Cerrar sesión', action: 'logout' },
  ];

  profesionalMenu = [
    // { title: 'Agendas programadas', component: AgendasPage, icon: 'md-calendar' },
    { title: 'Cerrar sesión', action: 'logout', icon: 'log-out' },
  ];


  constructor(
    public deviceProvider: DeviceProvider,
    public authProvider: AuthProvider,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public network: NetworkProvider,
    public connectivity: ConnectivityProvider,
    public googleMaps: GoogleMapsProvider,
    private alertCtrl: AlertController,
    public storage: Storage) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.deviceProvider.init();

      if (config.REMEMBER_SESSION) {
        this.authProvider.checkAuth().then((user: any) => {
          // if (!user.profesionalId) {
          //   this.rootPage = TurnosPage;
          // } else {
          //   this.rootPage = AgendasPage;
          // }
          this.network.setToken(this.authProvider.token);
          this.deviceProvider.update().then(() => true, () => true);
          this.rootPage = HomePage;
        }).catch(() => {
          this.rootPage = HomePage;
        });
      } else {
        this.rootPage = HomePage;
      }

      this.authProvider.checkVersion(config.APP_VERSION).then((result:any) => {
        switch (result.status) {
          case 'ok':
            break;
          case 'new-version':
            this.notificarNuevaVersión();
            break;
          case 'update-require':
            this.obligarDescarga(result.expiredDate);
            break;
        }
      }).catch(() => {

      });



      if ((window as any).cordova && (window as any).cordova.plugins.Keyboard) {
        (window as any).cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        (window as any).cordova.plugins.Keyboard.disableScroll(true);
      }

      this.connectivity.init();
      this.googleMaps.loadGoogleMaps().then(() => { }, () => { });
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
      this.nav.push(page.component);
    } else {
      switch (page.action) {
        case 'logout':
          this.logout();
          break;
      }
    }
  }


  notificarNuevaVersión() {
    let alert = this.alertCtrl.create({
      title: 'Nueva versión',
      subTitle: 'Hay una nueva versión disponible para descargar.',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {

          }
        },
        {
          text: 'Descargar',
          handler: () => {
            window.open('market://details?id=org.andes.mobile');
          }
        }
      ]
    });
    alert.present();
  }

  obligarDescarga(expiredDate) {
    debugger;
    let diff = moment(expiredDate).diff(moment(), 'days', true);
    let message;
    if (diff < 0) {
      message = 'Tienes que actualizar la aplicación para seguir usandola.';
    } else {
      diff = Math.ceil(diff);
      message = 'Tu versión de la aplicación va a quedar obsoleta en ' + diff + ' días. Actualízala antes que expire.';
    }
    let alert = this.alertCtrl.create({
      title: 'Nueva versión',
      subTitle: message,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            if (diff < 0) {
              this.platform.exitApp();
            }
          }
        },
        {
          text: 'Descargar',
          handler: () => {
            window.open('market://details?id=org.andes.mobile');
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present();
  }

}
