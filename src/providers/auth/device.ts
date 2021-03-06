import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

// providers
import { NetworkProvider } from './../network';

import { ENV } from '@app/env';
import { CampaniaDetallePage } from 'src/app/pages/datos-utiles/campanias/detalle/campania-detalle';
import { RupAdjuntarPage } from 'src/app/pages/profesional/rup-adjuntar/rup-adjuntar';


@Injectable()
export class DeviceProvider {
    public currentDevice: any;
    public registrationId: string = null;
    public navCtrl: NavController;
    private baseUrl = 'modules/mobileApp';

    public navigateTo: any = null;
    public notification: Observable<any>;

    constructor(
        public device: Device,
        public storage: Storage,
        public network: NetworkProvider) {

        this.storage.get('current_device').then((currentDevice) => {
            if (currentDevice) {
                this.currentDevice = currentDevice;
            }
        });

    }

    /**
     * Register in push notifications server
     */
    init() {
        this.notification = new Observable(observer => {
            if ((window as any).PushNotification) {
                const push = (window as any).PushNotification.init({
                    android: {
                    },
                    ios: {
                        alert: 'true',
                        badge: true,
                        sound: 'false'
                    },
                    windows: {}
                });
                push.on('registration', (data) => this.onRegister(data));
                push.on('notification', (data) => this.onNotification(data, observer));
                push.on('error', (data) => this.onError(data));
            }
        });
    }

    /**
     * Persist the registration ID
     * @param data Objeto
     */
    onRegister(data: any) {
        this.registrationId = data.registrationId;
    }

    /**
     * Call when notification arrive
     * @param data Notificación
     */
    onNotification(data: any, observer: any) {
        if (data.additionalData.action === 'rup-adjuntar') {
            observer.next({
                component: RupAdjuntarPage,
                extras: { id: data.additionalData.id }
            });
        }
        if (data.additionalData.action === 'campaniaSalud') {
            observer.next({
                component: CampaniaDetallePage,
                extras: { campania: data.additionalData.campania }
            });
        }

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
                device_id: this.registrationId,
                device_type: this.device.platform + ' ' + this.device.version,
                app_version: ENV.APP_VERSION
            };

            this.network.post(this.baseUrl + '/devices/register', params).then((data) => {
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

            const device = {
                id: this.currentDevice.id,
                device_id: this.registrationId,
                device_type: this.device.platform + ' ' + this.device.version,
                app_version: ENV.APP_VERSION
            };

            this.network.post(this.baseUrl + '/devices/update', { device }).then((data) => {
                this.currentDevice = data;
                this.storage.set('current_device', this.currentDevice);
                return resolve(this.currentDevice);
            }, reject);
        });
    }

    remove() {
        return new Promise((resolve, reject) => {
            if (!this.device.cordova) {
                reject();
                return;
            }

            this.network.post(this.baseUrl + '/devices/delete', { id: this.currentDevice.id }).then((data) => {
                this.currentDevice = data;
                this.storage.set('current_device', this.currentDevice);
                return resolve(this.currentDevice);
            }, reject);

            this.storage.remove('current_device');
            this.currentDevice = null;

        });
    }

    sync() {
        if (ENV.REMEMBER_SESSION) {
            this.register().then(() => true, () => true);
        } else {
            if (this.currentDevice) {
                this.update().then(() => true, () => true);
            } else {
                this.register().then(() => true, () => true);
            }
        }
    }

}
