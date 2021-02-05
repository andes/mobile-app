import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './../network';

@Injectable()
export class CategoriasProvider {
    public user: any;
    private baseUrl = 'modules/mobileApp/categoria';

    constructor(
        public network: NetworkProvider) {
    }

    get(params) {
        return this.network.get(this.baseUrl, params);
    }

}
