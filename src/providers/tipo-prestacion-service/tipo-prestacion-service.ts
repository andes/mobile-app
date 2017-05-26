import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/*
  Generated class for the TipoPrestacionServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TipoPrestacionServiceProvider {

  private tipoPrestacionUrl = 'http://192.168.0.13:3002/hidatidosis-api/modules/hidatidosis/hidatidosis';  // URL to web api

  constructor(public http: Http) {
    console.log('Hello TipoPrestacionServiceProvider Provider');
  }

  getTipoPrestacion(): Observable<any[]> {
     return this.http.get(this.tipoPrestacionUrl)    
      // ...and calling .json() on the response to return data
      .map((res: Response) => res.json())
      //...errors if any
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

  }
}
