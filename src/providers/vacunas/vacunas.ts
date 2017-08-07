import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import config from '../../config';

import { AuthProvider } from '../auth/auth';
/*
  Generated class for the VacunasProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class VacunasProvider {
  public user: any;
  private baseUrl = config.API_URL + 'modules/mobileApp';

  constructor(public http: Http, public authProvider: AuthProvider) {
    this.user = this.authProvider.user;
  }

  get(params) {
    return new Promise((resolve, reject) => {
      let headers = this.authProvider.getHeaders();
debugger;
      this.http.get(this.baseUrl + '/vacunas', { search: params, headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
}
