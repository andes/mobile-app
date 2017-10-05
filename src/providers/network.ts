import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

// providers
import { ToastProvider } from "./toast";

import config from '../config';

@Injectable()
export class NetworkProvider {
  private token: string = null;
  private baseUrl = config.API_URL;

  constructor(
    public http: Http,
    private toastCtrl: ToastProvider) {
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (this.token) {
      headers.append('Authorization', 'JWT ' + this.token);
    }
    return headers;
  }

  request(url, data) {
    return new Promise((resolve, reject) => {
      let headers = this.getHeaders();
      let config = {
        ...data,
        headers
      }
      this.http.request(this.baseUrl + url, config)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          if (err.status == 0) {
            this.toastCtrl.danger("No hay conexión a internet.");
            reject();
          } else {
            try {
              reject(err.json());
            } catch (e) {
              reject({ error: err });
            }
          }
        });
    });
  }

  get(url, params = {}) {
    return this.request(url, { params, method: 'GET' });
  }

  post(url, body, params = {}) {
    return this.request(url, { body, params, method: 'POST' });
  }

  put(url, body, params = {}) {
    return this.request(url, { body, params, method: 'PUT' });
  }

  patch(url, body, params = {}) {
    return this.request(url, { body, params, method: 'PATCH' });
  }

}
