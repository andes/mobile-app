import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthProvider } from '../../providers/auth/auth';
import 'rxjs/add/operator/map';

/*
  Generated class for the UsuariosProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UsuariosProvider {

  private usuariosUrl = 'http://localhost:8080/api';
  private herokuUrl = 'https://vast-stream-22862.herokuapp.com/api/modules/turnosmobile';

  constructor(public authService: AuthProvider, public http: Http) {
    console.log('Hello UsuariosProvider Provider');
  }

  getUsuarios() {

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Authorization', this.authService.token);

      this.http.get(this.herokuUrl + '/app', { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });

  }
}
