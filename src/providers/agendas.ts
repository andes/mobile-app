import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class AgendasProvider {
  public user: any;
  private baseUrl = 'modules/turnos';
  private baseUrlMobile = 'modules/mobileApp';

  constructor(
    public network: NetworkProvider) {

  }

  get(params) {
    return this.network.get(this.baseUrl + '/agenda', params);
  }

  getById(id) {
    return this.network.get(this.baseUrl + '/agenda/' + id);
  }

  getAgendasDisponibles(params) {
    return this.network.get(this.baseUrlMobile + '/agendasDisponibles', params);
  }

  patch(id, params) {
    return this.network.patch(this.baseUrl + '/agenda/' + id, params, {});
  }

  save(turno: any, options: any = {}) {
    if (turno.idAgenda) {
      return this.network.patch(this.baseUrl + '/turno/' + turno.idTurno + '/bloque/' + turno.idBloque + '/agenda/' + turno.idAgenda, turno, options);
    }
  }
}

