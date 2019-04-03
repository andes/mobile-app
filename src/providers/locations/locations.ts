import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// providers
import { NetworkProvider } from '../network';

@Injectable()
export class LocationsProvider {
    public centros: any[] = [];
    private baseUrl = 'core/tm';

    constructor(
        public storage: Storage,
        public network: NetworkProvider) {

    }

    getV2() {
        return new Observable(observer => {
            if (this.centros.length <= 0) {
                // Desactivamos la cache
                // this.storage.get('centros-salud').then(centros => {
                //     if (centros) {
                //         this.centros = centros;
                //         observer.next(centros);
                //     }
                // });
                this.network.get(this.baseUrl + '/organizaciones').then((data: any[]) => {
                    if (data) {
                        let centrosSalud = data;
                        let limit = data.length;
                        for (let i = 0; i <= limit; i++) {
                            if (centrosSalud[i] && centrosSalud[i].direccion && centrosSalud[i].direccion.geoReferencia) {
                                this.centros.push(centrosSalud[i]);
                            }
                        }
                        observer.next(this.centros);
                    } else {
                        return [];
                    }
                    // this.set('centros-salud', this.centros);
                }).catch((error) => {
                    return;
                });
            } else {
                observer.next(this.centros);
            }
        });
    }
}
