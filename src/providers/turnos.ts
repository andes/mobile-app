import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';
import config from '../config';

// providers
import { NetworkProvider } from './network';
import { AuthProvider } from './auth/auth';


@Injectable()
export class TurnosProvider {
  public user: any;
  private baseUrl = 'modules/mobileApp';

  constructor(
    public http: Http,
    public storage: Storage,
    public authProvider: AuthProvider,
    public network: NetworkProvider) {

    this.user = this.authProvider.user;
  }

  get(params) {
    return this.network.get(this.baseUrl + '/turnos', params);
  }

  cancelarTurno(body) {
    return this.network.post(this.baseUrl + '/turnos/cancelar', body, {});
  }

  confirmarTurno(body) {
    return this.network.post(this.baseUrl + '/turnos/confirmar', body, {});
  }
}

