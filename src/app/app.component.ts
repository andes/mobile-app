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
import { DatosGestionProvider } from '../providers/datos-gestion/datos-gestion.provider';
import { ToastProvider } from './../providers/toast';

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
import { Events } from 'ionic-angular';
import { ProfileProfesionalComponents } from '../pages/profesional/profile/profile-profesional';
import * as moment from 'moment';
import { OrganizacionesPage } from '../pages/login/organizaciones/organizaciones';
moment.locale('es');


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
        { title: 'Punto saludable', component: PuntoSaludablePage },
        { title: 'NotiSalud', component: FeedNoticiasPage },
        { title: 'Preguntas frecuentes', component: FaqPage },
        { title: 'Cerrar sesión', action: 'logout', color: 'danger' },
    ];

    profesionalMenu: any = [
        { title: 'Datos personales', component: ProfileProfesionalComponents },
        { title: 'Punto saludable', component: PuntoSaludablePage },
        { title: 'NotiSalud', component: FeedNoticiasPage },
        { title: 'Preguntas frecuentes', component: FaqPage },
        { title: 'Cerrar sesión', action: 'logout', color: 'danger' },
    ];


    anonymousMenu = [
        { title: 'Ingresar en ANDES', component: LoginPage, color: 'primary' },
        { title: 'Punto saludable', component: PuntoSaludablePage },
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
        public storage: Storage,
        public sqlite: SQLite,
        public datosGestion: DatosGestionProvider,
        private toast: ToastProvider,
        public events: Events) {

        this.initializeApp();
        events.subscribe('myEvent', () => {
            this.checkTipoIngreso('gestion');
        });
        events.subscribe('checkProf', () => {
            this.checkTipoIngreso('profesional');
        });
    }

    initializeApp() {
        this.platform.ready().then(async () => {
            this.createDatabase();
            this.statusBar.styleLightContent();
            this.splashScreen.hide();
            this.deviceProvider.init();
            if (this.platform.is('ios')) {
                this.statusBar.overlaysWebView(false);
            }

            this.deviceProvider.notification.subscribe((data) => {
                this.nav.push(data.component, data.extras);
            });
            let gestion = await this.authProvider.checkGestion();
            let sesion = await this.authProvider.checkSession();
            if (sesion) {
                if (gestion) {
                    this.authProvider.checkAuth().then((user: any) => {
                        this.network.setToken(this.authProvider.token);
                        this.deviceProvider.update().then(() => true, () => true);
                        this.rootPage = Principal;
                    }).catch(() => {
                    });
                } else {
                    this.authProvider.checkAuth().then((user: any) => {
                        this.network.setToken(this.authProvider.token);
                        this.deviceProvider.update().then(() => true, () => true);
                        this.rootPage = HomePage;
                    }).catch(() => {
                    });
                }
            } else {
                this.rootPage = HomePage;
            }

            if ((window as any).cordova && (window as any).cordova.plugins.Keyboard) {
                (window as any).cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                (window as any).cordova.plugins.Keyboard.disableScroll(true);
            }

            if (this.authProvider.user && this.authProvider.user.esGestion) {
                // this.profesionalMenu.unshift({ title: 'Ingresar como Profesional', component: OrganizacionesPage })

            }

            this.connectivity.init();
        });
    }

    isLoged() {
        return this.authProvider.user !== null;
    }

    isProfesional() {
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
            if (page.id && page.id === 'gestion') {
                this.nav.setRoot(page.component);
            } else {
                this.nav.push(page.component);
            }

        } else {
            switch (page.action) {
                case 'logout':
                    this.logout();
                    break;
                case 'cleanCache':
                    this.cleanCache();
                    break;

            }
        }
    }

    cleanCache() {
        this.showConfirm('¿Desea borrar los datos almacenados en la aplicación?', '').then(async () => {
            await this.datosGestion.deleteTablasSqLite();
            await this.datosGestion.crearTablasSqlite();
            await this.datosGestion.migrarDatos({});
            this.toast.success('La caché se limpió exitosamente.');
        }).catch(() => {
            this.toast.danger('Limpieza de caché cancelada.');
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

    checkTipoIngreso(tipo) {
        if (this.profesionalMenu.length >= 6) {
            this.profesionalMenu.splice(0, 1);
        }
        if (this.authProvider.user && this.authProvider.user.esGestion) {
            switch (tipo) {
                case 'gestion':
                    this.profesionalMenu.unshift({ title: 'Ingresar como Gestion', component: Principal, id: 'gestion' });
                    break;
                case 'profesional':
                    this.profesionalMenu.unshift({ title: 'Ingresar como Profesional', component: OrganizacionesPage });
                    break;
            }
        }
    }

    private async createDatabase() {

        this.sqlite.create({
            name: 'data.db',
            location: 'default' // the location field is required
        })
            .then((db) => {
                return this.datosGestion.setDatabase(db);
            }).catch(error => {
                return (error);
            });


    }

}
