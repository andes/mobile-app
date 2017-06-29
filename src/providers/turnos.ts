import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import config from '../config';
import { AuthProvider } from './auth/auth';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TurnosProvider {
  public user: any;
  private baseUrl = config.API_URL + 'modules/turnos/turno';



  constructor(public http: Http, public storage: Storage, public auth: AuthProvider) {
    this.user = this.auth.user;
  }

  get() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.auth.token);
      this.http.get(this.baseUrl + '/?pacienteId=' + this.user.idPaciente, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
}

