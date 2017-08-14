import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

@Injectable()
export class ConnectivityProvider {

  onDevice: boolean;
  isConnected: boolean;

  constructor(
    public platform: Platform,
    private network: Network) {

    this.onDevice = this.platform.is('cordova');
    this.isConnected = true;
  }

  init() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('Network was disconnected :-(');
      this.isConnected = false;
    });

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('Network was connected :-)');
      this.isConnected = true;
    });

  }


  isOnline(): boolean {
    return this.isConnected;
  }

  isOffline(): boolean {
    return !this.isConnected;
  }
}
