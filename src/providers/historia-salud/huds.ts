import { Injectable } from '@angular/core';
import { NetworkProvider } from './../network';

@Injectable()
export class HudsProvider {
    private baseUrl = 'modules/huds';

    constructor(public network: NetworkProvider) { }

    getAccesos(params: any) {
        const headers = this.network.getHeaders();
        return this.network.get(`${this.baseUrl}/accesos`, params, { headers });
    }
}
