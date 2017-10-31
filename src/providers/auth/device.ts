import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';

// providers
import { NetworkProvider } from './../network';

import { ENV } from '@app/env';
import { NavController } from 'ionic-angular';
import { RupAdjuntarPage } from '../../pages/profesional/rup-adjuntar/rup-adjuntar';


@Injectable()
export class DeviceProvider {
  public currentDevice: any;
  public registrationId: string = null;
  public navCtrl: NavController;
  public notificationArrive: boolean = false;
  private baseUrl = 'modules/mobileApp';

  constructor(
    public device: Device,
    public storage: Storage,
    public network: NetworkProvider ) {

    this.storage.get('current_device').then((device) => {
      if (device) {
        this.currentDevice = device;
      }
    });

  }

  /**
   * Register in push notifications server
   */
  init() {
    if ((window as any).PushNotification) {
      let push = (window as any).PushNotification.init({
        android: {
        },
        ios: {
          alert: "true",
          badge: true,
          sound: 'false'
        },
        windows: {}
      });

      push.on('registration', (data) => this.onRegister(data));
      push.on('notification', (data) => this.onNotification(data));
      push.on('error', (data) => this.onError(data));

    }
  }

  /**
   * Persist the registration ID
   * @param data
   */
  onRegister(data: any) {
    console.log("Register ID:", data.registrationId);
    this.registrationId = data.registrationId;
  }

  /**
   * Call when notification arrive
   * @param data
   */
  onNotification(data: any) {
    // console.log('Notification arrive', data);
    if (data.additionalData.action === 'rup-adjuntar') {
      this.notificationArrive = true;
      this.navCtrl.push(RupAdjuntarPage, { notification: data });
    }

  }

  /**
   * Call on error
   * @param data
   */
  onError(data: any) {
    console.log('Notification error', data);
  }

  register() {
    return new Promise((resolve, reject) => {
      if (!this.device.cordova) {
        reject();
        return;
      }

      let params = {
        device_id: this.registrationId,
        device_type: this.device.platform + " " + this.device.version,
        app_version: ENV.APP_VERSION
      };

      this.network.post(this.baseUrl + '/devices/register', params).then((data) => {
        this.currentDevice = data;
        this.storage.set('current_device', this.currentDevice);
        resolve(this.currentDevice);
      }, reject);

    });
  }

  update() {
    return new Promise((resolve, reject) => {
      if (!this.device.cordova) {
        reject();
        return;
      }

      let device = {
        id: this.currentDevice.id,
        device_id: this.registrationId,
        device_type: this.device.platform + " " + this.device.version,
        app_version: ENV.APP_VERSION
      };

      this.network.post(this.baseUrl + '/devices/update', { device }).then((data) => {
        this.currentDevice = data;
        this.storage.set('current_device', this.currentDevice);
        resolve(this.currentDevice);
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
        resolve(this.currentDevice);
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
