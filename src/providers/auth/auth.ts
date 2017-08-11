import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular';

// providers
import { NetworkProvider } from './../network';

import config from '../../config';

@Injectable()
export class AuthProvider {

  public token: any;
  public user: any;
  private authUrl = 'modules/mobileApp';
  private appUrl = 'auth';

  constructor(
    public storage: Storage,
    public menuCtrl: MenuController,
    public network: NetworkProvider) {

    this.user = null;
    this.token = null;
  }

  getHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (this.token) {
      headers.append('Authorization', 'JWT ' + this.token);
    }
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
    return this.network.post(this.authUrl + '/registro', details, {});
  }

  updateAccount(details) {
    return this.network.patch(this.authUrl + '/account', details, {});
  }


  login(credentials) {
    return this.network.post(this.authUrl + '/login', credentials, {}).then((data: any) => {
      this.token = data.token;
      this.user = data.user;
      this.storage.set('token', data.token);
      this.storage.set('user', data.user);
      this.network.setToken(data.token);
      this.menuCtrl.enable(true);
      return Promise.resolve(data);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  loginProfesional(credentials) {
    return this.network.post(this.appUrl + '/login', credentials, {}).then((data: any) => {
      this.token = data.token;
      this.user = data.user;
      this.storage.set('token', data.token);
      this.storage.set('user', data.user);
      this.network.setToken(data.token);
      this.menuCtrl.enable(true);
      return Promise.resolve(data);
    }).catch((err) => {
      return Promise.reject(err);
    });

  }

  verificarCodigo(datos) {
    return this.network.post(this.authUrl + '/verificar-codigo', datos, {}).then((data: any) => {
      this.token = data.token;
      this.user = data.user;
      this.storage.set('token', data.token);
      this.storage.set('user', data.user);
      this.network.setToken(data.token);
      this.menuCtrl.enable(true);
      return Promise.resolve(data);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  reenviarCodigo(emailEnviado) {
    let email = { 'email': emailEnviado };
    return this.network.post(this.authUrl + '/reenviar-codigo', email, {});
  }

  logout() {
    this.storage.set('token', '');
    this.storage.set('user', '');
    this.token = null;
    this.user = null;
    this.menuCtrl.enable(false);
  }

  update(data) {
    return this.network.put(this.authUrl + '/account', data, {}).then((data: any) => {
      this.user = data.account;
      return Promise.resolve(data);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }


}
