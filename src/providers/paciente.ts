import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import * as moment from 'moment/moment';
import config from '../config';

// providers
import { NetworkProvider } from './network';
import { AuthProvider } from './auth/auth';

@Injectable()
export class PacienteProvider {
  public paciente: any;
  private baseUrl = 'modules/mobileApp';

  constructor(
    public http: Http,
    public storage: Storage,
    public authProvider: AuthProvider,
    public network: NetworkProvider
  ) {
    // this.user = this.auth.user;
  }

  get(id) {
    return this.network.get(this.baseUrl + '/paciente/' + id, {}).then((paciente) => {
      this.paciente = paciente;
      return Promise.resolve(paciente);
    }).catch(err => Promise.reject(err));
  }

  update(id, data) {
    return this.network.put(this.baseUrl + '/paciente/' + id, data, {});
  }

}

