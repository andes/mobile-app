import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

// providers
import { ToastProvider } from './toast';
import { ENV } from '@app/env';
import { BehaviorSubject, Observable } from 'rxjs';
import { Network } from '@ionic-native/network';
import { Platform, ToastController } from 'ionic-angular';

export enum ConnectionStatus {
    Online,
    Offline
}

@Injectable()
export class NetworkProvider {
    private token: string = null;
    private baseUrl = ENV.API_URL;
    private ApiMobileUrl = ENV.API_MOBILE_URL;
    private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

    constructor(
        public http: Http,
        private toastProvider: ToastProvider,
        private toastController: ToastController,
        private network: Network,
        private plt: Platform
    ) {
        this.plt.ready().then(() => {
            this.initializeNetworkEvents();
            let status = network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
            this.status.next(status);
        });

    }

    setToken(token) {
        this.token = token;
    }

    getHeaders() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if (this.token) {
            headers.append('Authorization', 'JWT ' + this.token);
        }
        return headers;
    }

    request(url, data, options = null) {
        return new Promise((resolve, reject) => {
            let headers = this.getHeaders();
            let config = {
                ...data,
                headers
            }
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
            let headers = this.getHeaders();
            let config = {
                ...data,
                headers
            }
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

        let connection = status === ConnectionStatus.Offline ? 'Offline' : 'Online';
        let toast = this.toastController.create({
            message: `You are now ${connection}`,
            duration: 3000,
            position: 'bottom'
        });
        toast = await toast.present();
        // toast.then(toast => toast.present());
    }

    public onNetworkChange(): Observable<ConnectionStatus> {
        return this.status.asObservable();
    }

    public getCurrentNetworkStatus(): any {
        let rta = this.status.getValue() === ConnectionStatus.Online ? 'online' : 'offline';
        // console.log('estado en el get ', this.status);
        // return this.status.getValue();
        return rta;
    }


}
