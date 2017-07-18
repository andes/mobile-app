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
export class PacienteProvider {
  public user: any;
  private baseUrl = config.API_URL + 'modules/turnosmobile';

  constructor(
    public http: Http,
    public storage: Storage,
    public auth: AuthProvider
  ) {
    this.user = this.auth.user;
  }

  get(id) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.auth.token);
      this.http.get(this.baseUrl + '/paciente/' + id, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
}

