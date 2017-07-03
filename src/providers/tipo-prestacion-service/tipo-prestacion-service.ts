import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

// import { Server } from '@andes/shared';

/*
  Generated class for the TipoPrestacionServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TipoPrestacionServiceProvider {

  private tipoPrestacionUrl = 'http://192.168.0.13:3002/api/core/tm/tiposPrestaciones';  // URL to web api

  constructor(public http: Http) {
    //
  }

  /**
       * Metodo get. Trae el objeto tipoPrestacion.
       * @param {any} params Opciones de busqueda
       */
  // get(params: any): Observable<any[]> {
  //   return this.server.get(this.tipoPrestacionUrl, { params: params, showError: true })
  // }

  // getTipoPrestacion(): Observable<any[]> {

  //   let headers = new Headers();
  //   headers.append('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5MmMyNTcyMTk5MWE4MmM0NGIzMDcxMyIsInVzdWFyaW8iOnsibm9tYnJlQ29tcGxldG8iOiIyOTQxMDQyOCAyOTQxMDQyOCIsIm5vbWJyZSI6IjI5NDEwNDI4IiwiYXBlbGxpZG8iOiIyOTQxMDQyOCIsInVzZXJuYW1lIjoyOTQxMDQyOCwiZG9jdW1lbnRvIjoyOTQxMDQyOH0sInJvbGVzIjpbWyJtZWRpY28iXV0sInByb2Zlc2lvbmFsIjpudWxsLCJvcmdhbml6YWNpb24iOnsiX2lkIjoiNTdlOTY3MGU1MmRmMzExMDU5YmM4OTY0Iiwibm9tYnJlIjoiSE9TUElUQUwgUFJPVklOQ0lBTCBORVVRVUVOIC0gRFIuIEVEVUFSRE8gQ0FTVFJPIFJFTkRPTiIsImlkIjoiNTdlOTY3MGU1MmRmMzExMDU5YmM4OTY0In0sInBlcm1pc29zIjpbInR1cm5vczpwbGFuaWZpY2FyQWdlbmRhOnByZXN0YWNpb246NTg5NDY1N2U3MzU4YWYzOTRmNmQ1MmUyIiwidHVybm9zOnBsYW5pZmljYXJBZ2VuZGE6cHJlc3RhY2lvbjo1OGE2ZTdiOTMxYzkwMzUxMjdhNzU0NDQiLCJ0dXJub3M6cGxhbmlmaWNhckFnZW5kYTpwcmVzdGFjaW9uOjU4OTljMWFjMTU5ZWI0NWQ3MTIzNmU1NCIsInR1cm5vczpkYXJUdXJub3M6ZGVsRGlhLHByb2dyYW1hZG9zIiwidHVybm9zOmRhclR1cm5vczpwYXJhUHJvZmVzaW9uYWwiLCJ0dXJub3M6ZGFyVHVybm9zOnByZXN0YWNpb246NTg5NDY1N2U3MzU4YWYzOTRmNmQ1MmUyIiwidHVybm9zOmRhclR1cm5vczpwcmVzdGFjaW9uOjU4YTZlN2I5MzFjOTAzNTEyN2E3NTQ0NCIsInR1cm5vczpkYXJUdXJub3M6cHJlc3RhY2lvbjo1ODk5YzFhYzE1OWViNDVkNzEyMzZlNTQiLCJ0dXJub3M6ZGFyVHVybm9zOnByb2Zlc2lvbmFsOjU4OWM1YjVkNGM4NWQwMjgxODkzNDRiMyIsInR1cm5vczpjbG9uYXJBZ2VuZGEiLCJ0dXJub3M6ZWRpdGFyRXNwYWNpbyJdLCJpYXQiOjE0OTYwNjUzOTQsImV4cCI6MTQ5NjkyOTM5NH0.XTlXzW485KQjVw9IDslwpr_VSqCzBN9HdJ-q0LO9x2A');

  //   let options = new RequestOptions({ headers: headers });

  //   return this.http.get(this.tipoPrestacionUrl, options)
  //     // ...and calling .json() on the response to return data
  //     .map((res: Response) => res.json())
  //     //...errors if any
  //     .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  // }
}
