import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import * as moment from 'moment/moment';
import config from '../config';

// providers
import { AuthProvider } from './auth/auth';

@Injectable()
export class PacienteProvider {
  public paciente: any;
  private baseUrl = config.API_URL + 'modules/mobileApp';

  constructor(
    public http: Http,
    public storage: Storage,
    public authProvider: AuthProvider
  ) {
    // this.user = this.auth.user;
  }

  get(id) {
    return new Promise((resolve, reject) => {
      let headers = this.authProvider.getHeaders();
      this.http.get(this.baseUrl + '/paciente/' + id, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.paciente = data;
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  update(id, data) {
    return new Promise((resolve, reject) => {
      let headers = this.authProvider.getHeaders();
      this.http.put(this.baseUrl + '/paciente/' + id, JSON.stringify(data), { headers: headers }).map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

}

