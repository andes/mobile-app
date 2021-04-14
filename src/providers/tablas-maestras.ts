import { Injectable } from '@angular/core';
// providers
import { NetworkProvider } from './network';

@Injectable()
export class TablasMaestras {
    public organizaciones: any;

    private baseUrl = 'core/tm';
    private authUrl = 'auth';

    constructor(
        private network: NetworkProvider
    ) {
        // this.user = this.auth.user;
    }

    provincias() {
        return this.network.get(this.baseUrl + '/provincias', {});
    }

    localidades(filter) {
        return this.network.get(this.baseUrl + '/localidades', filter);
    }

}

