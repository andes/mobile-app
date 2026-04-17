import { Injectable } from '@angular/core';
import { NetworkProvider } from './../network';

@Injectable()
export class RecetasProvider {
    public user: any;
    private baseUrl = 'modules/recetas';

    constructor(public network: NetworkProvider) { }

    get(params: any) {
        const headers = this.network.getHeaders();
        return this.network.get(this.baseUrl, params, { headers });
    }
}
