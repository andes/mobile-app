import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

//providers
import { NetworkProvider } from './../network';

import config from '../../config';

@Injectable()
export class VacunasProvider {
  public user: any;
  private baseUrl = 'modules/mobileApp';

  constructor(
    public network: NetworkProvider) {
  }

  get(params) {
    return this.network.get(this.baseUrl + '/vacunas', params);
  }
}
