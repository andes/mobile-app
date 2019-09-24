import { ToastProvider } from './../providers/toast';
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
import { DatosGestionProvider } from '../providers/datos-gestion/datos-gestion.provider';

// Pages
import { HomePage } from '../pages/home/home';
import { ProfileAccountPage } from '../pages/profile/account/profile-account';
import { FaqPage } from '../pages/datos-utiles/faq/faq';

import { ENV } from '@app/env';
import { LoginPage } from '../pages/login/login';
import { TabViewProfilePage } from '../pages/profile/paciente/tab-view-profile';
import { FeedNoticiasPage } from '../pages/datos-utiles/feed-noticias/feed-noticias';
import { PuntoSaludablePage } from '../pages/datos-utiles/punto-saludable/punto-saludable';
import { Principal } from '../pages/gestion/principal';
import { SQLite } from '@ionic-native/sqlite';

import { ProfileProfesionalComponents } from '../pages/profesional/profile/profile-profesional';

import * as moment from 'moment';
moment.locale('es');


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    esProfesional: Boolean;
    rootPage: any = null;
    // isGestion = false;
    menu;

    constructor(
        public deviceProvider: DeviceProvider,
        public authProvider: AuthProvider,
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public network: NetworkProvider,
        public connectivity: ConnectivityProvider,
        private alertCtrl: AlertController,
        public storage: Storage,
        public sqlite: SQLite,
        public datosGestion: DatosGestionProvider,
        private toast: ToastProvider) {

        this.initializeApp();

    }

    initializeApp() {
        this.platform.ready().then(async () => {
            this.createDatabase();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.deviceProvider.init();
            if (this.platform.is('ios')) {
                this.statusBar.overlaysWebView(false);
            }
            this.rootPage = HomePage;
            this.deviceProvider.notification.subscribe((data) => {
                this.nav.push(data.component, data.extras);
            });

            if (await this.authProvider.checkSession()) {
                await this.authProvider.checkAuth();
                // this.isGestion = await this.authProvider.checkGestion();
                this.network.setToken(this.authProvider.token);
                this.deviceProvider.update().then(() => true, () => true);
                if (await this.authProvider.checkGestion()) {
                    this.rootPage = Principal;
                }
            }

            // await this.getMenu();

            // else {
            //     this.rootPage = HomePage;
            // }

            // this.authProvider.checkVersion(ENV.APP_VERSION).then((result: any) => {
            //     switch (result.status) {
            //         case 'ok':
            //             break;
            //         case 'new-version':
            //             this.notificarNuevaVersión();
            //             break;
            //         case 'update-require':
            //             this.obligarDescarga(result.days);
            //             break;
            //     }
            // }).catch(() => {

            // });

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

    isProfesional() {
        return this.authProvider.user && this.authProvider.user.profesionalId;
    }

     getMenu() {
        const pacienteMenu = [
            { title: 'Datos personales', component: TabViewProfilePage },
            { title: 'Configurar cuenta', component: ProfileAccountPage },
            { title: 'Punto saludable', component: PuntoSaludablePage },
            { title: 'NotiSalud', component: FeedNoticiasPage },
            { title: 'Preguntas frecuentes', component: FaqPage },
            { title: 'Cerrar sesión', action: 'logout', color: 'danger' },
        ];

        let profesionalMenu = [
            { title: 'Datos personales', component: ProfileProfesionalComponents },
            { title: 'Punto saludable', component: PuntoSaludablePage },
            { title: 'NotiSalud', component: FeedNoticiasPage },
            { title: 'Preguntas frecuentes', component: FaqPage },
            { title: 'Borrar Caché', action: 'cleanCache' },
            { title: 'Cerrar sesión', action: 'logout', color: 'danger' },
        ];

        const anonymousMenu = [
            { title: 'Ingresar en ANDES', component: LoginPage, color: 'primary' },
            { title: 'Punto saludable', component: PuntoSaludablePage },
            { title: 'NotiSalud', component: FeedNoticiasPage },
            { title: 'Preguntas frecuentes', component: FaqPage },
        ];

        // this.menu = 
        return this.authProvider.user ?
            (this.authProvider.user.profesionalId ? profesionalMenu : pacienteMenu)
            : anonymousMenu;

    }

    logout() {
        // this.isGestion = false;
        this.deviceProvider.remove().then(() => true, () => true);
        this.authProvider.logout();
        this.nav.setRoot(HomePage);
    }

    cleanCache() {
        this.showConfirm('¿Desea borrar los datos almacenados en la aplicación?', '').then(() => {
            this.datosGestion.resetDataBase();
            this.toast.success('La caché se limpió exitosamente.');
        }).catch(() => {
            this.toast.danger('Limpieza de caché cancelada.');
        });
    }

    menuClick(page) {
        if (page.component) {
            this.nav.push(page.component);
        } else {
            switch (page.action) {
                case 'logout':
                    this.logout();
                    break;
                case 'cleanCache':
                    this.cleanCache();
                    break;
                case 'goToProfesional':
                    // this.goToProfesional();
                    this.rootPage = HomePage;
                    break;
                case 'goToGestion':
                    // this.goToGestion();
                    this.rootPage = Principal;
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
                        window.open(`market://details?id=${ENV.REPOSITORIO}`);
                    }
                }
            ]
        });
        alert.present();
    }

    obligarDescarga(days) {
        let message;
        if (days && days > 0) {
            message = 'Tu versión de la aplicación va a quedar obsoleta en ' + (days === 1 ? 'un día' : days + ' días.') + ' Actualízala antes que expire.';
        } else {
            message = 'Tienes que actualizar la aplicación para seguir usándola.';
        }
        let alert = this.alertCtrl.create({
            title: 'Nueva versión',
            subTitle: message,
            enableBackdropDismiss: false,
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
                        window.open(`market://details?id=${ENV.REPOSITORIO}`);
                        this.platform.exitApp();
                    }
                }
            ]
        });
        alert.present();
    }

    private async createDatabase() {

        this.sqlite.create({
            name: 'data.db',
            location: 'default' // the location field is required
        }).then((db) => {
            return this.datosGestion.setDatabase(db);
        }).catch(error => {
            return (error);
        });


    }

    showConfirm(title, message) {
        return new Promise((resolve, reject) => {
            this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [
                    {
                        text: 'Cancelar',
                        handler: reject
                    },
                    {
                        text: 'Aceptar',
                        handler: resolve
                    }
                ]
            }).present();
        });
    }
}
