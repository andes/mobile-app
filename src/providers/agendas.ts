import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

// providers
import { NetworkProvider } from './network';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AgendasProvider {
  public user: any;
  // private baseUrl = 'modules/turnos';
  private baseUrl = ENV.API_URL;
  private ApiMobileUrl = ENV.API_MOBILE_URL;
  private baseUrlMobile = 'modules/mobileApp';
  private baseUrlCitas = 'modules/turnos';
  token: any;

  constructor(
    public network: NetworkProvider,
    private http: HttpClient,
    public storage: Storage
  ) {

  }

  get(params) {
    return this.http.get(this.baseUrl + '/agenda', params);
  }

  getById(id) {
    const token = this.network.getToken();
    const headers = new HttpHeaders({ Authorization: 'JWT ' + token });
    const options = { headers };
    return this.http.get(this.ApiMobileUrl + this.baseUrlCitas + '/agenda/' + id, options);
  }

  getAgendasDisponibles(query) {
    const token = this.network.getToken();
    const headers = new HttpHeaders({ Authorization: 'JWT ' + token });
    const params = new HttpParams({ fromObject: query });
    const options = { headers, params };
    return this.http.get(this.ApiMobileUrl + this.baseUrlMobile + '/agendasDisponibles', options);
  }

  patch(id, params) {
    const token = this.network.getToken();
    const headers = new HttpHeaders({ Authorization: 'JWT ' + token });
    const options = { headers };
    // return this.network.patch(this.baseUrl + '/agenda/' + id, params, {});
    return this.http.patch(this.ApiMobileUrl + this.baseUrlCitas + '/agenda/' + id, params, options);

  }

  save(turno: any, options) {
    if (turno.idAgenda) {
      const token = this.network.getToken();
      const headers = new HttpHeaders({ Authorization: 'JWT ' + token });
      options.headers = headers;
      return this.http.patch(this.ApiMobileUrl + this.baseUrlCitas + '/turno/' + turno.idTurno + '/bloque/' + turno.idBloque + '/agenda/' +
        turno.idAgenda, turno, options);
    }
  }
}

