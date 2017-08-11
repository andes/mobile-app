import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Network } from 'ionic-native';
import { Platform } from 'ionic-angular';

declare var Connection;
/*
  Generated class for the ConnectivityProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ConnectivityProvider {

  onDevice: boolean;

  constructor(public platform: Platform, public http: Http) {
    this.onDevice = this.platform.is('cordova');
  }

  isOnline(): boolean {
    if (this.onDevice && Network.connection) {
      return Network.connection !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  isOffline(): boolean {
    if (this.onDevice && Network.connection) {
      return Network.connection === Connection.NONE;
    } else {
      return !navigator.onLine;
    }
  }
}
