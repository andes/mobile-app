import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// providers
import { NetworkProvider } from '../network';

@Injectable()
export class LocationsProvider {
    private centros: any[] = null;
    private baseUrl = 'core/tm';

    constructor(
        public storage: Storage,
        public network: NetworkProvider,
        public http: Http) {

    }

    getV2 () {
        return new Observable(observer => {
            if (!this.centros) {
                this.storage.get('centros-salud').then(centros => {
                    if (centros) {
                        this.centros = centros;
                        observer.next(centros);
                    }
                });
                this.network.get(this.baseUrl + '/organizacionesCache').then((data: any[]) => {
                    this.centros = data;
                    observer.next(this.centros);
                    this.storage.set('centros-salud', this.centros);
                }).catch(() => {
                    return;
                });
            } else {
                observer.next(this.centros);
            }
        });
    }
}
