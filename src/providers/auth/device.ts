import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

// providers
import { NetworkProvider } from './../network';

import { ENV } from '@app/env';
import { AuthProvider } from './auth';
import { ToastProvider } from '../toast';

@Injectable()
export class DeviceProvider {
    public currentDevice: any;
    public registrationId: string = null;
    public fcmToken: string = null;
    public navCtrl: NavController;
    private baseUrl = 'modules/mobileApp';

    public navigateTo: any = null;
    public notification: Observable<any>;
    datosBgPush: any;

    constructor(
        private ngZone: NgZone,
        public device: Device,
        public storage: Storage,
        public authService: AuthProvider,
        private alertCtrl: AlertController,
        private toastCtrl: ToastProvider,
        public network: NetworkProvider,
        private fcm: FirebaseMessaging,
        private router: Router,
        private callNumber: CallNumber
    ) {
        this.storage.get('current_device').then((currentDevice) => {
            if (currentDevice) {
                this.currentDevice = currentDevice;
            } else {
                this.onRegisterDevice(this.device.uuid);
            }
        });
    }

    /**
     * Register in push notifications server
     */
    init() {

        this.requestPermissionFCM();

        // Captura cualquier mensaje en foreground (app en foco)
        this.foregroundMessagesFCM();

        // Captura mensaje en background (app fuera de foco)
        this.backgroundMessagesFCM();

        // Si se detecta un nuevo token
        this.fcm.onTokenRefresh().subscribe((token) => {
            this.onRegisterFCM(token);
        });
    }

    private requestPermissionFCM() {
        this.fcm.requestPermission().then((hasPermission) => {
            console.log('Push Notifications permitted: ', hasPermission);
        });

        // Token necesario para envío de push notifications
        this.fcm.getToken().then((token) => {
            console.log(token);
            this.onRegisterFCM(token);
            console.log(this.device.uuid);
        });
    }

    private foregroundMessagesFCM() {
        this.fcm.onMessage().subscribe((data) => {
            if (data.wasTapped) {
                // Recibido en background: no hacemos nada (ver onBackgroundMessage abajo)
            } else {
                // Recibido en foreground
                this.ngZone.run(() => {
                    this.onNotificationForeground(JSON.parse(data.extraData));
                });
            }
            console.log('onMessage', data);
        });
    }

    private backgroundMessagesFCM() {
        this.fcm.onBackgroundMessage().subscribe((data) => {
            console.log('onBackgroundMessage', data);

            this.ngZone.run(() => {
                this.onNotificationBackground(JSON.parse(data.extraData));
            });
        });
    }


    getRoute(action: any) {
        switch (action) {
            case 'rup-adjuntar':
                return 'profesional/adjuntar';
            case 'campaniaSalud':
                return 'datos-utiles/campania-detalle';
            case 'suspender-turno':
            case 'suspender-turno':
                return 'notificaciones-turnos';
            case 'codigoVerificacion':
                return 'registro/user-data';
        }
    }

    public getToken() {
        // Token necesario para envío de push notifications
        return this.fcm.getToken();
    }

    /**
     * Persist the registration ID
     * @param data String ID
     */
    onRegisterDevice(uuid: string) {
        this.registrationId = uuid;
    }

    /**
     * Persist the FCM token
     * @param data String token
     */
    onRegisterFCM(data: any) {
        this.fcmToken = data;
    }
    /**
     * background: la notificación llega cuando la app está fuera de foco (muestra push notification, se activa al tocarla)
     * @param route La ruta a la que redirecciona
     * @param data Notificación
     */
    onNotificationBackground(queryParams: any) {

        // Ruta
        const route = this.getRoute(queryParams.action);

        // La acción es de un turno?
        if (queryParams.action.indexOf('-turno') > -1) {
            queryParams = this.dataTurno(queryParams);
        }

        // Se redirecciona pasando los params
        if (route && queryParams) {
            this.ngZone.run(async () => {
                this.router.navigate([route], { queryParams });
            });
        }
    }


    /**
    * Call when notification arrive from FOREGROUND
    * @param data Notificación
    * foreground: la notificación llega cuando la app está en foco (NO muestra push notification)
    */
    async onNotificationForeground(queryParams: any) {

        // Ruta
        const route = this.getRoute(queryParams.action);

        try {
            if (queryParams.action === 'rup-adjuntar') {
                queryParams = await this.rupAdjuntar(queryParams);
            }

            if (queryParams.action === 'campaniaSalud') {
                queryParams = await this.campaniaSalud(queryParams);
            }

            if (queryParams.action === 'suspender-turno' || queryParams.action === 'reasignar-turno') {
                queryParams = this.dataTurno(queryParams);
            }

            if (queryParams.action === 'codigoVerificacion') {
                queryParams = await this.codigoVerificacion(queryParams);
            }
        } catch (err) {
            console.log(err);
        }

        if (route && queryParams) {
            this.ngZone.run(() => {
                this.router.navigate([route], { queryParams });
            });
        }

    }

    private async codigoVerificacion(data: any) {
        const credentials = {
            email: data.userEmail,
            password: data.codigo,
        };
        let queryParams;
        try {
            const login = await this.authService.login(credentials);
            if (login) {
                this.sync();
                this.router.navigateByUrl('/home');
                return;
            }
        } catch (err) {
            if (err.message === 'new_password_needed') {
                queryParams = {
                    email: data.userEmail,
                    old_password: data.codigo,
                };
            } else {
                this.toastCtrl.danger(
                    'Email o password incorrecto.'
                );
            }

        }
        return queryParams;
    }

    private async campaniaSalud(data: any) {
        const datos: any = await this.prompt(data);
        let queryParams;
        if (datos) {
            queryParams = { campania: datos.id };
        }
        return queryParams;
    }

    private async rupAdjuntar(datosAdjuntar: any) {
        let queryParams;
        const rupData = this.rupPromptData(datosAdjuntar);
        this.datosBgPush = await this.prompt(rupData);

        if (this.datosBgPush) {
            queryParams = { id: this.datosBgPush.id };
        }
        return queryParams;
    }

    rupPromptData(data: any) {
        let queryParams;

        if (data) {
            queryParams = {
                ...data,
                ...{
                    header: 'Consulta RUP',
                    subHeaader: 'Adjuntar documento',
                    message:
                        'Se detectó un pedido para adjuntar un documento desde Andes.',
                    btnText: 'Ir a RUP',
                },
            };
        }
        return queryParams;
    }

    dataTurno(data: any) {
        let queryParams;
        if (data) {
            queryParams = {
                turno: JSON.stringify(data.turno), // ID
                organizacion: JSON.stringify(data.organizacion),
                action: data.action
            };
        }
        return queryParams;
    }

    async prompt(datos) {
        const alert = await this.alertCtrl.create({
            header: datos.header,
            subHeader: datos.subHeader,
            message: datos.message || '',
            buttons: [
                this.cancelBtn(),
                this.acceptBtn(datos),
            ],
        });
        await alert.present();
        const { role } = await alert.onDidDismiss();
        if (role === 'aceptado') {
            return datos;
        }
    }

    private acceptBtn(datos: any) {
        return {
            text: datos.btnText,
            role: 'aceptado',
            handler: () => {
                return true;
            },
        };
    }

    private cancelBtn() {
        return {
            text: 'Cancelar',
            role: 'cancelado',
            cssClass: 'secondary',
            handler: (cancel) => {
                return true;
            },
        };
    }

    /**
     * Call on error
     * @param data Notificación
     */
    onError(data: any) {
        console.error('Notification error', data);
    }

    register() {
        return new Promise((resolve, reject) => {
            if (!this.device.cordova) {
                reject();
                return;
            }

            const params = {
                device_id: this.device.uuid,
                device_fcm_token: this.fcmToken,
                device_type: this.device.platform + ' ' + this.device.version,
                app_version: ENV.APP_VERSION,
            };

            this.network
                .post(this.baseUrl + '/devices/register', params)
                .then((data) => {
                    this.currentDevice = data;
                    this.storage.set('current_device', this.currentDevice);
                    return resolve(this.currentDevice);
                }, reject);
        });
    }

    update() {
        return new Promise((resolve, reject) => {
            if (!this.device.cordova) {
                reject();
                return;
            }

            if (this.currentDevice.id) {
                const device = {
                    id: this.currentDevice.id,
                    device_id: this.device.uuid,
                    device_fcm_token: this.fcmToken,
                    device_type:
                        this.device.platform + ' ' + this.device.version,
                    app_version: ENV.APP_VERSION,
                };

                this.network
                    .post(this.baseUrl + '/devices/update', { device })
                    .then((data) => {
                        this.currentDevice = data;
                        this.storage.set('current_device', this.currentDevice);
                        return resolve(this.currentDevice);
                    }, reject);
            } else {
                return;
            }
        });
    }

    remove() {
        return new Promise((resolve, reject) => {
            if (!this.device.cordova) {
                reject();
                return;
            }

            this.network
                .post(this.baseUrl + '/devices/delete', {
                    id: this.currentDevice.id,
                })
                .then((data) => {
                    return resolve(data);
                }, reject);

            this.storage.remove('current_device');
            this.currentDevice = null;
        });
    }

    sync() {
        if (ENV.REMEMBER_SESSION) {
            this.register().then(
                () => true,
                () => true
            );
        } else {
            if (this.currentDevice) {
                this.update().then(
                    () => true,
                    () => true
                );
            } else {
                this.register().then(
                    () => true,
                    () => true
                );
            }
        }
    }

    llamarPorTelefono(numero) {
        this.callNumber.callNumber(numero, true)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err));
    }

}
