import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import * as moment from 'moment/moment';

// providers
import { NetworkProvider } from './network';

import config from '../config';
@Injectable()
export class AgendasProvider {
  public user: any;
  private baseUrl = 'modules/turnos';

  constructor(
    public network: NetworkProvider) {

  }

  get(params) {
    return this.network.get(this.baseUrl + '/agenda', params);
  }

  patch(id, params) {
    return this.network.patch(this.baseUrl + '/agenda/' + id, params, {});
  }
}

