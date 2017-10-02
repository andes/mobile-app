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
  private authV2Url = 'modules/mobileApp/v2';

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

  _createAccount(details) {
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

  selectOrganizacion(data) {
    return this.network.post(this.appUrl + '/organizaciones', data, {}).then((data: any) => {
      this.token = data.token;
      this.storage.set('token', data.token);
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


  /**
   * Solo verificacmos que temos un código valido.
   * @param {string} email
   * @param {string} code
   */
  checkCode(email, code) {
    return this.network.post(this.authV2Url + '/check', { email, code });
  }

  /**
   * Validamos los datos del scanneo y el código.
   * @param {string} email Email de la cuenta
   * @param {string} code Codigo de verificacion
   * @param {object} scan Datos del escaneo
   */
  validarAccount(email, code, scan) {
    return this.network.post(this.authV2Url + '/verificar', {email, code, paciente: scan});
  }

  /**
   * Revalidamos todos los datos y creamos la cuenta
   * @param {string} email Email de la cuenta
   * @param {string} code Codigo de verificacion
   * @param {object} scan Datos del escaneo
   * @param {string} password Password a setear
   */
  createAccount(email, code, scan, password) {
    return this.network.post(this.authV2Url + '/registrar', {email, code, password, paciente: scan}).then((data: any) => {

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

  /**
   * Generar un codigo para reestablecer contraseña y luego
   * enviar un email con el codigo generado
   *
   * @param {string} email Email de la cuenta
   * @returns Promise
   * @memberof AuthProvider
   */
  sendCode(email) {
    return this.network.post(this.authUrl + '/olvide-password', { email: email }).then((res: any) => {
      return Promise.resolve(res);
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  /**
   * Resetear el password de un usuario
   *
   * @param {string} email Email del usuario al cambiar el password
   * @param {string} codigo Codigo de verificación enviado por email
   * @param {string} password Nuevo password
   * @param {string} password2 Re ingreso de nuevo password
   * @returns
   * @memberof AuthProvider
   */
  restorePassword(email, codigo, password, password2) {
    const dto = {
      email: email,
      codigo: codigo,
      password: password,
      password2: password2
    };

    return this.network.post(this.authUrl + '/reestablecer-password', dto).then(res => {
      return Promise.resolve(res);
    }).catch(err => {
      return Promise.reject(err);
    });
  }
}
