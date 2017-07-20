import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import config from '../config';
import { AuthProvider } from './auth/auth';
import * as moment from 'moment/moment';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ConstanteProvider {
  public organizaciones: any;

  private baseUrl = config.API_URL + 'core/tm';
  private authUrl = config.API_URL + 'auth';

  constructor(
    public http: Http,
    public storage: Storage,
    public auth: AuthProvider
  ) {
    // this.user = this.auth.user;
  }

  provincias() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.auth.token);
      this.http.get(this.baseUrl + '/provincias', { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  localidades(filter) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.auth.token);
      this.http.get(this.baseUrl + '/localidades', { params: filter, headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  getOrganizaciones(usuario) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.auth.token);
      let params: any = {};
      if (usuario) {
        params.usuario = usuario;
      }
      this.http.get(this.authUrl + '/organizaciones', { params, headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.organizaciones = data;
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }



}

