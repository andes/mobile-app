import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// providers
import { ToastProvider } from './toast';
import { ENV } from '@app/env';
import { BehaviorSubject, Observable } from 'rxjs';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { StorageService } from 'src/providers/storage-provider.service';

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
        public http: HttpClient,
        private toastProvider: ToastProvider,
        private toastController: ToastController,
        private network: Network,
        private plt: Platform,
        private storage: StorageService

    ) {
        this.plt.ready().then(() => {
            this.initializeNetworkEvents();
            const status = network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
            this.status.next(status);
            this.storage.get('token').then(token => {
                this.setToken(token);
            });
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

    request(url: string, data: any, options: any = null): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = this.getHeaders(); // Esto debe retornar un objeto de tipo HttpHeaders
            const config: any = {
                headers,
                ...options
            };

            this.http.request('POST', this.baseUrl + url, {
                ...config,
                body: data // Aquí va el cuerpo de la petición
            }).subscribe({
                next: (res) => {
                    resolve(res); // res ya es JSON
                },
                error: (err) => {
                    if (err.status === 0) {
                        if (!options || !options.hideNoNetwork) {
                            this.toastProvider.danger(
                                'Andes se encuentra momentáneamente fuera de servicio. Vuelva a intentar más tarde.'
                            );
                        }
                        reject(); // sin datos, solo error de red
                    } else {
                        // err.error ya contiene el JSON parseado automáticamente
                        reject(err.error || err);
                    }
                }
            });
        });
    }

    requestMobileApi(url: string, data: any, options: any = null): Promise<any> {
        return new Promise((resolve, reject) => {
            const headers = this.getHeaders(); // Debe devolver un HttpHeaders
            const config: any = {
                headers,
                ...options
            };

            this.http.request('POST', this.ApiMobileUrl + url, {
                ...config,
                body: data
            }).subscribe({
                next: (res) => {
                    resolve(res); // res ya es JSON automáticamente
                },
                error: (err) => {
                    if (err.status === 0) {
                        if (!options || !options.hideNoNetwork) {
                            this.toastProvider.danger('No hay conexión para actualizar datos');
                        }
                        reject();
                    } else {
                        reject(err.error || err);
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
