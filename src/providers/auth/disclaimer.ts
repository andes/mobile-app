import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from '../../providers/network';

@Injectable()
export class DisclaimersProvider {
    private baseUrl = 'core/tm/disclaimer';

    constructor(
        public network: NetworkProvider) {

    }

    get(opciones: any, showError = true) {
        return this.network.get(this.baseUrl, { activo: opciones.activo, showError: showError });
    }

}

