import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthProvider } from '../../providers/auth/auth';
import 'rxjs/add/operator/map';
import config from '../../config';

/*
  Generated class for the UsuariosProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UsuariosProvider {

  private baseURL = config.API_URL + 'modules/turnosmobile';

  constructor(public authService: AuthProvider, public http: Http) {
    //
  }

  getUsuarios() {

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Authorization', this.authService.token);

      this.http.get(this.baseURL + '/app', { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });

  }
}
