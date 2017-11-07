import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class RupProvider {
  public user: any;
  private baseUrl = 'modules/mobileApp';

  constructor(
    public network: NetworkProvider) {

  }

  get(params) {
    return this.network.get(this.baseUrl + '/prestaciones-adjuntar', params);
  }

  patch(id, data) {
    return this.network.patch(this.baseUrl + '/prestaciones-adjuntar/' + id, data);
  }

}

