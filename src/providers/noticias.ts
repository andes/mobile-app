import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class NoticiasProvider {
    public user: any;
    private baseUrl = 'modules/mobileApp';

    constructor(
        private network: NetworkProvider) {
    }

    puntoSaludable(params) {
        return this.network.get(this.baseUrl + '/noticias/puntosaludable', params);
    }

}
