import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import config from '../../config';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {

  public token: any;
  public user: any;
  private authUrl = config.API_URL + 'modules/turnosmobile';

  constructor(public http: Http, public storage: Storage) {
    //
  }

  checkAuth() {
    return new Promise((resolve, reject) => {
      this.storage.get('token').then((token) => {
        if (!token) {
          reject();
          return;
        }
        this.storage.get('user').then((user) => {
          if (!user) {
            reject();
            return;
          }
          this.token = token;
          this.user = user;
          resolve();
        });
      });
    });
  }

  // checkAuthentication() {

  //   return new Promise((resolve, reject) => {

  //     //Load token if exists
  //     this.storage.get('token').then((value) => {

  //       this.token = value;

  //       let headers = new Headers();
  //       headers.append('Authorization', this.token);

  //       // this.http.get('http://192.168.0.13:8080/api/auth/protected', { headers: headers })
  //       this.http.get(this.herokuUrl + '/protected', { headers: headers })
  //         .subscribe(res => {
  //           resolve(res);
  //         }, (err) => {
  //           reject(err);
  //         });

  //     });
  //   });
  // }

  createAccount(details) {

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      debugger;
      this.http.post(this.authUrl + '/registro', JSON.stringify(details), { headers: headers })
        .subscribe(res => {

          let data = res.json();
          this.token = data.token;
          this.storage.set('token', data.token);
          resolve(data);

        }, (err) => {          
          reject(err);          
        });

    });

  }

  login(credentials) {

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(this.authUrl + '/login', JSON.stringify(credentials), { headers: headers })
        .subscribe(res => {
          let data = res.json();
          this.token = data.token;
          this.user = data.user;
          this.storage.set('token', data.token);
          this.storage.set('user', data.user);
          resolve(data);

          resolve(res.json());
        }, (err) => {
          reject(err);
        });

    });

  }

  verificarCodigo(datos) {
    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(this.authUrl + '/verificar-codigo', JSON.stringify(datos), { headers: headers })
        .subscribe(res => {
          let data = res.json();
          this.token = data.token;
          this.user = data.user;
          this.storage.set('token', data.token);
          this.storage.set('user', data.user);
          resolve(data);
        }, (err) => {
          reject(err);
        });

    });
  }

  reenviarCodigo(emailEnviado) {
    return new Promise((resolve, reject) => {
      let email = { 'email': emailEnviado };

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(this.authUrl + '/reenviar-codigo', JSON.stringify(email), { headers: headers })
        .subscribe(res => {
          let data = res.json();
          resolve(res.json());
        }, (err) => {
          reject(err);
        });

    });
  }

  logout() {
    this.storage.set('token', '');
    this.storage.set('user', '');
    this.token = null;
    this.user = null;
  }
}
