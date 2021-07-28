import { ErrorReporterProvider } from 'src/providers/errorReporter';
import { Component, ViewChild } from '@angular/core';
import { AlertController, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkProvider } from 'src/providers/network';
import { DeviceProvider } from 'src/providers/auth/device';
import { ENV } from '@app/env';
import { AuthProvider } from 'src/providers/auth/auth';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { ToastProvider } from 'src/providers/toast';
import { HomePage } from './home/home-page';
import { EventsService } from './providers/events.service';
import { ConnectivityService } from './providers/connectivity.service';
import { Router } from '@angular/router';
import { SQLite } from '@ionic-native/sqlite/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    constructor(
        private deviceProvider: DeviceProvider,
        public authProvider: AuthProvider,
        private platform: Platform,
        private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private network: NetworkProvider,
        private connectivity: ConnectivityService,
        private alertCtrl: AlertController,
        private sqlite: SQLite,
        private datosGestion: DatosGestionProvider,
        private toast: ToastProvider,
        private events: EventsService,
        private router: Router,
        private reporter: ErrorReporterProvider,
        private navCtrl: NavController
    ) {
        this.initializeApp();
    }

    @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;

    esProfesional: boolean;
    esGestion: boolean;
    rootPage: any = null;


    initializeApp() {

        // Navegación con botón "back" del celular
        this.platform.backButton.subscribeWithPriority(10, async () => {
            // No se puede ir para atrás? => Salir / Cancelar
            if (!this.routerOutlet.canGoBack() && this.routerOutlet.getLastUrl() === '/home') {
                this.showConfirm('¿Salir de Andes?', 'Se va a cerrar la aplicación.').then(salir => {
                    if (salir === true) {
                        (navigator as any).app.exitApp();
                    }
                });
                // Ir para atrás
            } else {
                this.navCtrl.back();
            }
        });

        this.platform.ready().then(async () => {

            if (this.platform.is('cordova')) {
                this.statusBar.styleLightContent();
                this.splashScreen.hide();
                this.createDatabase();

                // Iniciar FCM sólo si es un dispositivo
                if (this.platform.is('mobile') || this.platform.is('tablet')) {
                    this.deviceProvider.init();
                }
            }
            if (this.platform.is('ios')) {
                this.statusBar.overlaysWebView(false);
            }

            const gestion = await this.authProvider.checkGestion();
            const sesion = await this.authProvider.checkSession();

            if (sesion) {
                if (gestion) {
                    this.esGestion = true;

                    this.authProvider.checkAuth().then((user: any) => {
                        this.network.setToken(this.authProvider.token);
                        this.deviceProvider.update().then(() => true, () => true);
                        this.rootPage = HomePage;

                    }).catch(err => {
                        console.error('Auth error', err);
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
                this.events.profesionalMenu.unshift({ title: 'Ingresar como Profesional', url: '/login/organizaciones' });
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
            if (this.authProvider.user.profesionalId) {
                this.events.menu$.next(this.events.profesionalMenu);
            } else {
                this.events.menu$.next(this.events.pacienteMenu);
            }
            return this.events.getMenu();
        } else {
            this.events.menu$.next(this.events.anonymousMenu);
            return this.events.anonymousMenu;
        }
    }

    logout() {
        this.deviceProvider.remove().then(() => true, () => true);
        this.authProvider.logout();
        this.router.navigate(['home']);
    }

    cleanCache() {
        this.showConfirm('¿Desea borrar los datos almacenados en la aplicación?', '').then(async () => {
            try {
                await this.datosGestion.deleteTablasSqLite();
                await this.datosGestion.crearTablasSqlite();
                await this.datosGestion.migrarDatos({});
                this.toast.success('La caché se limpió exitosamente.');
            } catch (error) {
                this.toast.danger(error);
            }
        }).catch((e) => {
            this.toast.danger('Limpieza de caché cancelada.');
        });
    }

    report() {
        this.reporter.report();
    }

    showConfirm(title, message) {
        return new Promise(async (resolve, reject) => {
            const alert = await this.alertCtrl.create({
                header: title,
                message,
                buttons: [
                    {
                        text: 'Cancelar',
                        handler: () => { resolve(false); }
                    },
                    {
                        text: 'Aceptar',
                        handler: () => { resolve(true); }
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



    private async createDatabase() {

        try {
            await this.sqlite.selfTest();
            this.sqlite.create({
                name: 'data.db',
                location: 'default' // the location field is required
            }).then((db) => {
                return this.datosGestion.setDatabase(db);
            }).catch(error => {
                return (error);
            });
        } catch (err) {
            console.error(`Error al inicializar SQLite: "${err}".\nDebe correr la app en un emulador o dispositivo.`);
            return false;
        }


    }
}
