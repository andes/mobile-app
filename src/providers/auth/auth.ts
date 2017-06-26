import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthProvider {

  public token: any;
  private authUrl = 'http://localhost:3002/api/modules/turnosmobile';
  private herokuUrl = 'https://vast-stream-22862.herokuapp.com/api/modules/turnosmobile';

  constructor(public http: Http, public storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }

  checkAuthentication() {

    return new Promise((resolve, reject) => {

      //Load token if exists
      this.storage.get('token').then((value) => {

        this.token = value;

        let headers = new Headers();
        headers.append('Authorization', this.token);

        // this.http.get('http://192.168.0.13:8080/api/auth/protected', { headers: headers })
        this.http.get(this.authUrl + '/protected', { headers: headers })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });

      });
    });
  }

  createAccount(details) {

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(this.authUrl + '/registro', JSON.stringify(details), { headers: headers })
        .subscribe(res => {

          let data = res.json();
          this.token = data.token;
          this.storage.set('token', data.token);
          resolve(data);

        }, (err) => {
          reject({ status: err.status, error: JSON.parse(err._body) });
        });

    });

  }

  login(credentials) {

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      // this.http.post('https://vast-stream-22862.herokuapp.com/api/auth/login', JSON.stringify(credentials), { headers: headers })
      this.http.post(this.authUrl + '/login', JSON.stringify(credentials), { headers: headers })
        .subscribe(res => {

          let data = res.json();
          this.token = data.token;
          debugger;
          this.storage.set('token', data.token);
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

      this.http.post(this.authUrl + '/verificarCodigo', JSON.stringify(datos), { headers: headers })
        .subscribe(res => {
          debugger;
          let data = res.json();
          // this.token = data.token;
          // debugger;
          // this.storage.set('token', data.token);
          // resolve(data);

          resolve(res.json());
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
      debugger;
      this.http.post(this.authUrl + '/reenviarCodigo', JSON.stringify(email), { headers: headers })
        .subscribe(res => {
          debugger;
          let data = res.json();

          resolve(res.json());
        }, (err) => {
          reject(err);
        });

    });
  }

  logout() {
    this.storage.set('token', '');
  }
}
