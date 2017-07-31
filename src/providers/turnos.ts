import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';
import config from '../config';

// providers
import { AuthProvider } from './auth/auth';


@Injectable()
export class TurnosProvider {
  public user: any;
  private baseUrl = config.API_URL + 'modules/mobileApp';

  constructor(
    public http: Http,
    public storage: Storage,
    public authProvider: AuthProvider) {

    this.user = this.authProvider.user;
  }

  get(params) {
    return new Promise((resolve, reject) => {
      let headers = this.authProvider.getHeaders();
      this.http.get(this.baseUrl + '/turnos', { search: params, headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  cancelarTurno(params) {
    return new Promise((resolve, reject) => {
      let headers = this.authProvider.getHeaders();
      this.http.post(this.baseUrl + '/turnos/cancelar', params, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  confirmarTurno(params) {
    return new Promise((resolve, reject) => {
      let headers = this.authProvider.getHeaders();
      this.http.post(this.baseUrl + '/turnos/confirmar', params, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
}

