import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// providers
import { NetworkProvider } from '../network';

@Injectable()
export class LocationsProvider {
    public centros: any[] = [];
    public centrosAraucania: any[] = [];
    private baseUrl = 'core/tm';

    constructor(
        private network: NetworkProvider) {
    }

    getV2() {
        return new Observable(observer => {
            if (this.centros.length <= 0) {
                this.network.get(this.baseUrl + '/organizaciones', { showMapa: true }).then((data: any[]) => {
                    if (data) {
                        const centrosSalud = data;
                        const limit = data.length;
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

    getCentrosAraucania() {
        //areaAraucania
        return new Observable(observer => {
            if (this.centrosAraucania.length <= 0) {
                this.network.get(this.baseUrl + '/areaAraucania').then((data: any[]) => {
                    if (data) {
                        this.centrosAraucania = data;
                        observer.next(this.centrosAraucania);
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
