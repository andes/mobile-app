import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './../network';

@Injectable()
export class VacunasProvider {
  public user: any;
  private baseUrl = 'modules/mobileApp';

  constructor(
    public network: NetworkProvider) {
  }

  get() {
    return this.network.get(this.baseUrl + '/vacunas');
  }

  getCount() {
    return this.network.get(this.baseUrl + '/vacunas/count');
  }
}
