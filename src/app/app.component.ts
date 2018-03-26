import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

// Providers
import { NetworkProvider } from './../providers/network';
import { AuthProvider } from '../providers/auth/auth';
import { DeviceProvider } from '../providers/auth/device';
import { ConnectivityProvider } from '../providers/connectivity/connectivity';

// Pages
import { HomePage } from '../pages/home/home';
import { ProfilePacientePage } from '../pages/profile/paciente/profile-paciente';
import { ProfileAccountPage } from '../pages/profile/account/profile-account';
import { FaqPage } from '../pages/datos-utiles/faq/faq';

import { ENV } from '@app/env';
import { LoginPage } from '../pages/login/login';
import { TabViewProfilePage } from '../pages/profile/paciente/tab-view-profile';
import { FeedNoticiasPage } from '../pages/datos-utiles/feed-noticias/feed-noticias';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    esProfesional: Boolean;
    rootPage: any = null;
    pacienteMenu = [
        { title: 'Datos personales', component: TabViewProfilePage },
        { title: 'Configurar cuenta', component: ProfileAccountPage },
        { title: 'NotiSalud', component: FeedNoticiasPage },
        { title: 'Preguntas frecuentes', component: FaqPage },
        { title: 'Cerrar sesión', action: 'logout', color: 'danger' },
    ];

    profesionalMenu = [
        { title: 'NotiSalud', component: FeedNoticiasPage },
        { title: 'Preguntas frecuentes', component: FaqPage },
        { title: 'Cerrar sesión', action: 'logout', color: 'danger' },
    ];

    anonymousMenu = [
        { title: 'Ingresar en ANDES', component: LoginPage,  color: 'primary' },
        { title: 'NotiSalud', component: FeedNoticiasPage },
        { title: 'Preguntas frecuentes', component: FaqPage },
    ];


    constructor(
        public deviceProvider: DeviceProvider,
        public authProvider: AuthProvider,
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public network: NetworkProvider,
        public connectivity: ConnectivityProvider,
        private alertCtrl: AlertController,
        public storage: Storage) {

        this.initializeApp();

    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.deviceProvider.init();
            //   this.deviceProvider.navCtrl = this.nav;
            this.rootPage = HomePage;
            this.deviceProvider.notification.subscribe((data) => {
                this.nav.push(data.component, data.extras);
            });

            if (ENV.REMEMBER_SESSION) {
                this.authProvider.checkAuth().then((user: any) => {
                    // if (!user.profesionalId) {
                    //   this.rootPage = TurnosPage;
                    // } else {
                    //   this.rootPage = AgendasPage;
                    // }
                    this.network.setToken(this.authProvider.token);
                    this.deviceProvider.update().then(() => true, () => true);
                    // this.rootPage = HomePage;
                }).catch(() => {
                    // this.rootPage = HomePage;
                });
            } else {
                // this.rootPage = HomePage;
            }

            this.authProvider.checkVersion(ENV.APP_VERSION).then((result: any) => {
                switch (result.status) {
                    case 'ok':
                        break;
                    case 'new-version':
                        this.notificarNuevaVersión();
                        break;
                    case 'update-require':
                        this.obligarDescarga(result.days);
                        break;
                }
            }).catch(() => {

            });



            if ((window as any).cordova && (window as any).cordova.plugins.Keyboard) {
                (window as any).cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                (window as any).cordova.plugins.Keyboard.disableScroll(true);
            }

            this.connectivity.init();
            // this.googleMaps.loadGoogleMaps().then(() => { }, () => { });
        });
    }

    isLoged() {
        return this.authProvider.user !== null;
    }

    isProfesional () {
        return this.authProvider.user && this.authProvider.user.profesionalId;
    }

    getMenu() {
        if (this.authProvider.user) {
            return this.authProvider.user.profesionalId ? this.profesionalMenu : this.pacienteMenu;
        } else {
            return this.anonymousMenu;
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

    obligarDescarga(days) {
        let message;
        if (days && days > 0) {
            message = 'Tu versión de la aplicación va a quedar obsoleta en ' + (days == 1 ? 'un día' : days + ' días.') + ' Actualízala antes que expire.';
        } else {
            message = 'Tienes que actualizar la aplicación para seguir usandola.';
        }
        let alert = this.alertCtrl.create({
            title: 'Nueva versión',
            subTitle: message,
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        if (!(days && days > 0)) {
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
