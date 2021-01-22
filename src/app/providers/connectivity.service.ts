import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

@Injectable()
export class ConnectivityService {

    onDevice: boolean;
    isConnected: boolean;

    constructor(
        public platform: Platform,
        private network: Network) {

        this.onDevice = this.platform.is('cordova');
        this.isConnected = true;
    }

    init() {
        this.network.onDisconnect().subscribe(() => {
            this.isConnected = false;
        });

        this.network.onConnect().subscribe(() => {
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
