import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class CampaniasProvider {
    private baseUrl = 'core/tm';

    constructor(
        public network: NetworkProvider) {
    }

    get() {
        return this.network.get(this.baseUrl + '/campanias', {});
    }

    getById(id: string) {
        return this.network.get(this.baseUrl + '/campania/' + id, {});
    }

}
