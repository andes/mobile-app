import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class FarmaciasProvider {
  public user: any;
  private baseUrl = 'modules/mobileApp/farmacias';

  constructor(
    public network: NetworkProvider) {

  }

  getLocalidades() {
    return this.network.get(this.baseUrl + '/localidades', {});
  }

  getTurnos(params) {
    return this.network.get(this.baseUrl + '/turnos', params);
  }

}

