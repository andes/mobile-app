import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class ProfesionalProvider {
    private baseUrl = 'core/tm';

    constructor(
        public network: NetworkProvider) {
    }

    getById(id: string) {
        return this.network.get(this.baseUrl + '/profesionales/?id=' + id, {});
    }

}
