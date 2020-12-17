import { Component } from '@angular/core';

import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkProvider } from 'src/providers/network';
import { DeviceProvider } from 'src/providers/auth/device';
import { FaqPage } from './pages/datos-utiles/faq/faq';
import { FeedNoticiasPage } from './pages/datos-utiles/feed-noticias/feed-noticias';
import { PuntoSaludablePage } from './pages/datos-utiles/punto-saludable/punto-saludable';
import { ENV } from '@app/env';
import { AuthProvider } from 'src/providers/auth/auth';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { ToastProvider } from 'src/providers/toast';
import { HomePage } from './home/home-page';
import { OrganizacionesPage } from './pages/login/organizaciones/organizaciones';
import { EventsService } from './providers/events.service';
import { ConnectivityService } from './providers/connectivity.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    constructor(
        public deviceProvider: DeviceProvider,
        public authProvider: AuthProvider,
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public network: NetworkProvider,
        public connectivity: ConnectivityService,
        private alertCtrl: AlertController,
        // public storage: Storage,
        // public sqlite: SQLite,
        public datosGestion: DatosGestionProvider,
        private toast: ToastProvider,
        public events: EventsService,
        private router: Router
    ) {
        this.initializeApp();
        this.events.getTipoIngreso().subscribe(tipo => {
            // this.checkTipoIngreso(tipo);
        });
    }

    esProfesional: boolean;
    rootPage: any = null;
    pacienteMenu = [
        // { title: 'Configurar cuenta', component: ProfileAccountPage },
        { title: 'Datos Personales', url: 'profile/view-profile', icon: 'person-circle-outline' },
        { title: 'Mi historial de turnos', url: 'turnos/historial', icon: 'document-text-outline' },
        { title: 'Punto saludable', url: 'datos-utiles/punto-saludable', icon: 'navigate-circle-outline' },
        { title: 'NotiSalud', url: 'datos-utiles/noticias', icon: 'newspaper-outline' },
        { title: 'Preguntas frecuentes', url: 'datos-utiles/faq', icon: 'help-circle-outline' },
    ];

    profesionalMenuOriginal: any = [
        { title: 'Datos personales', url: 'profesional/profile', icon: 'person-circle-outline' },
        { title: 'Punto saludable', url: 'datos-utiles/punto-saludable', icon: 'navigate-circle-outline' },
        { title: 'NotiSalud', url: 'datos-utiles/noticias', icon: 'newspaper-outline' },
        { title: 'Preguntas frecuentes', url: 'datos-utiles/faq', icon: 'help-circle-outline' },
    ];

    profesionalMenu = this.profesionalMenuOriginal.slice();

    anonymousMenu = [
        { title: 'Ingresar en ANDES', url: '/login', color: 'primary', icon: 'log-in-outline' },
        { title: 'Punto saludable', url: 'datos-utiles/punto-saludable', icon: 'navigate-circle-outline' },
        { title: 'NotiSalud', url: 'datos-utiles/noticias', icon: 'newspaper-outline' },
        { title: 'Preguntas frecuentes', url: 'datos-utiles/faq', icon: 'help-circle-outline' },
    ];

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
                // this.nav.push(data.component, data.extras);

            });

            const gestion = await this.authProvider.checkGestion();
            const sesion = await this.authProvider.checkSession();

            if (sesion) {
                if (gestion) {
                    this.authProvider.checkAuth().then((user: any) => {
                        this.network.setToken(this.authProvider.token);
                        this.deviceProvider.update().then(() => true, () => true);
                        this.rootPage = HomePage;
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

    get isLogged() {
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
        this.router.navigate(['home']);
    }

    menuClick(page) {
        if (page.component) {
            this.router.navigate([page.id]);
            if (page.id && page.id === 'gestion') {

                // this.nav.setRoot(page.component);
            } else {
                // this.nav.push(page.component);
                // this.router.navigate([page.id]);
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
        return new Promise(async (resolve, reject) => {
            const alert = await this.alertCtrl.create({
                header: title,
                message,
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
            });

            await alert.present();
        });
    }


    async notificarNuevaVersión() {
        const alert = await this.alertCtrl.create({
            header: 'Nueva versión',
            message: 'Hay una nueva versión disponible para descargar.',
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
        await alert.present();
    }

    async obligarDescarga(days) {
        let message;
        if (days && days > 0) {
            message = 'Tu versión de la aplicación va a quedar obsoleta en ' + (days === 1 ? 'un día' : days + ' días.') + ' Actualízala antes que expire.';
        } else {
            message = 'Tienes que actualizar la aplicación para seguir usándola.';
        }
        const alert = await this.alertCtrl.create({
            header: 'Nueva versión',
            message,
            // enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        if (!(days && days > 0)) {
                            (navigator as any).app.exitApp();
                        }
                    }
                },
                {
                    text: 'Descargar',
                    handler: () => {
                        window.open(`market://details?id=${ENV.REPOSITORIO}`);
                        (navigator as any).app.exitApp();
                    }
                }
            ]
        });
        await alert.present();
    }

    checkTipoIngreso(tipo) {
        this.profesionalMenu = this.profesionalMenuOriginal.slice();
        if (this.authProvider.user && this.authProvider.user.esGestion) {
            switch (tipo) {
                case 'gestion':
                    if (!this.profesionalMenu.find(x => x.id === 'gestion')) {
                        this.profesionalMenu.unshift({ title: 'Ingresar como Gestion', component: HomePage, id: 'gestion' })
                    }
                    break;
                case 'profesional':
                    if (!this.profesionalMenu.find(x => x.id === 'profesional')) {
                        this.profesionalMenu.unshift({
                            title: 'Ingresar como Profesional',
                            component: OrganizacionesPage, id: 'profesional'
                        });
                        const existeRegenerar = this.profesionalMenu.find(x => x.id === 'clean');
                        if (!existeRegenerar) {
                            const pos = this.profesionalMenu.length - 1;
                            this.profesionalMenu.splice(pos, 0, { title: 'Regenerar indicadores', action: 'cleanCache', id: 'clean' })
                        }
                    };
                    break;
            }
        }
    }

    private async createDatabase() {

        // this.sqlite.create({
        //     name: 'data.db',
        //     location: 'default' // the location field is required
        // })
        //     .then((db) => {
        //         return this.datosGestion.setDatabase(db);
        //     }).catch(error => {
        //         return (error);
        //     });


    }
}
