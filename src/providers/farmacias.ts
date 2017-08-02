import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import * as moment from 'moment/moment';
import config from '../config';

// providers


@Injectable()
export class FarmaciasProvider {
  public user: any;
  private baseUrl = config.API_URL + 'modules/mobileApp';

  constructor(
    public http: Http,
    public storage: Storage) {

  }

  getLocalidades() {

    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + '/farmacias/localidades', {})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

  getTurnos(params) {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + '/farmacias/turnos', { params })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }

}

