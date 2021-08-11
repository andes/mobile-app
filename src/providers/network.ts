import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

// providers
import { ToastProvider } from './toast';
import { ENV } from '@app/env';
import { BehaviorSubject, Observable } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

export enum ConnectionStatus {
    Online,
    Offline
}

@Injectable()
export class NetworkProvider {
    private token: string = null;
    private token$ = new BehaviorSubject(null);
    private baseUrl = ENV.API_URL;
    private ApiMobileUrl = ENV.API_MOBILE_URL;
    private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

    constructor(
        public http: Http,
        private toastProvider: ToastProvider,
        private toastController: ToastController,
        private network: Network,
        private plt: Platform,
        public storage: Storage

    ) {
        this.plt.ready().then(() => {
            this.initializeNetworkEvents();
            const status = network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
            this.status.next(status);
        });

        this.storage.get('token').then(token => {
            this.setToken(token);
        });

    }

    setToken(token) {
        this.token = token;
        this.token$.next(token);
    }

    getToken() {
        return this.token$.getValue();
    }

    getHeaders() {
        // tslint:disable-next-line: deprecation
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if (this.token) {
            headers.append('Authorization', 'JWT ' + this.token);
        }
        return headers;
    }

    request(url, data, options = null) {
        return new Promise((resolve, reject) => {
            const headers = this.getHeaders();
            const config = {
                ...data,
                headers
            };
            this.http.request(this.baseUrl + url, config)
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    if (err.status === 0) {
                        if (!options || !options.hideNoNetwork) {
                            this.toastProvider.danger('No hay conexión a internet.');
                        }
                        reject();
                    } else {
                        try {
                            reject(err.json());
                        } catch (e) {
                            reject({ error: err });
                        }
                    }
                });
        });
    }

    requestMobileApi(url, data, options = null) {
        return new Promise((resolve, reject) => {
            const headers = this.getHeaders();
            const config = {
                ...data,
                headers
            };
            this.http.request(this.ApiMobileUrl + url, config)
                .subscribe(res => {
                    resolve(res.json());
                }, (err) => {
                    if (err.status === 0) {
                        if (!options || !options.hideNoNetwork) {
                            this.toastProvider.danger('No hay conexión para actualizar datos');
                        }
                        reject();
                    } else {
                        try {
                            reject(err.json());
                        } catch (e) {
                            reject({ error: err });
                        }
                    }
                });
        });
    }


    get(url, params = {}, options = null) {
        return this.request(url, { params, method: 'GET' }, options);
    }

    getMobileApi(url, params = {}, options = null) {
        return this.requestMobileApi(url, { params, method: 'GET' }, options);
    }

    post(url, body, params = {}, options = null) {
        return this.request(url, { body, params, method: 'POST' }, options);
    }

    put(url, body, params = {}, options = null) {
        return this.request(url, { body, params, method: 'PUT' }, options);
    }

    patch(url, body, params = {}, options = null) {
        return this.request(url, { body, params, method: 'PATCH' }, options);
    }

    public initializeNetworkEvents() {
        this.network.onDisconnect().subscribe(() => {
            if (this.status.getValue() === ConnectionStatus.Online) {
                this.updateNetworkStatus(ConnectionStatus.Offline);
            }
        });

        this.network.onConnect().subscribe(() => {
            if (this.status.getValue() === ConnectionStatus.Offline) {
                this.updateNetworkStatus(ConnectionStatus.Online);
            }
        });
    }

    private async updateNetworkStatus(status: ConnectionStatus) {
        this.status.next(status);

        const connection = status === ConnectionStatus.Offline ? 'Se perdió' : 'Se reestableció';
        const color = status === ConnectionStatus.Offline ? 'danger' : 'success';

        const toast = await this.toastController.create({
            message: `${connection} la conexión a Internet`,
            duration: 3000,
            position: 'bottom',
            color: `${color}`
        });
        toast.present();
        // toast.then(toast => toast.present());
    }

    public onNetworkChange(): Observable<ConnectionStatus> {
        return this.status.asObservable();
    }

    public getCurrentNetworkStatus(): any {
        const rta = this.status.getValue() === ConnectionStatus.Online ? 'online' : 'offline';
        return rta;
    }


}
