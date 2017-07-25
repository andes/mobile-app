import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import config from '../../config';
import { MenuController } from 'ionic-angular';


/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {

  public token: any;
  public user: any;
  private authUrl = config.API_URL + 'modules/mobileApp';
  private appUrl = config.API_URL + 'auth';

  constructor(public http: Http, public storage: Storage, public menuCtrl: MenuController) {
    this.user = null;
  }


  getHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'JWT ' + this.token);
    return headers;
  }

  checkAuth() {
    return new Promise((resolve, reject) => {
      this.storage.get('token').then((token) => {
        if (!token) {
          reject();
          this.menuCtrl.enable(false);
          return;
        }
        this.storage.get('user').then((user) => {
          if (!user) {
            reject();
            this.menuCtrl.enable(false);
            return;
          }
          this.token = token;
          this.user = user;
          this.menuCtrl.enable(true);
          resolve(user);
        });
      });
    });
  }


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
          this.menuCtrl.enable(true);
          resolve(data);

          resolve(res.json());
        }, (err) => {
          reject(err);
        });

    });

  }

  loginProfesional(credentials) {

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(this.appUrl + '/login', JSON.stringify(credentials), { headers: headers })
        .subscribe(res => {
          let data = res.json();
          this.token = data.token;
          this.user = data.user;
          this.storage.set('token', data.token);
          this.storage.set('user', data.user);
          this.menuCtrl.enable(true);
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
          this.menuCtrl.enable(true);
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
    this.menuCtrl.enable(false);
  }

  update(data) {

    return new Promise((resolve, reject) => {

      let headers = this.getHeaders();

      this.http.put(this.authUrl + '/account', JSON.stringify(data), { headers: headers })
        .subscribe(res => {
          let data = res.json();
          this.user = data.account;
          resolve(data.account);
        }, (err) => {
          reject(err.json());
        });

    });

  }


}
