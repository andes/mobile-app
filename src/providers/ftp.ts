import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class FtpProvider {
    public user: any;
    private baseUrl = 'core/tm';

    constructor(
        public network: NetworkProvider) {

    }

    get(params) {
        return this.network.get(this.baseUrl + '/formularioTerapeutico', params);
    }

}
