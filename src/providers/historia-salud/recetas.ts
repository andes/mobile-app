import { Injectable } from '@angular/core';
import { NetworkProvider } from './../network';

@Injectable()
export class RecetasProvider {
    public user: any;
    private baseUrl = 'modules/recetas';

    constructor(public network: NetworkProvider) {}

    get(params) {
        const headers = this.network.getHeaders();
        const options = { headers };
        return this.network.get(`${this.baseUrl}`, params, options);
    }
}
