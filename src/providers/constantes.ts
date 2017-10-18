import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class ConstanteProvider {
  public organizaciones: any;

  private baseUrl = 'core/tm';
  private authUrl = 'auth';

  constructor(
    public network: NetworkProvider
  ) {
    // this.user = this.auth.user;
  }

  provincias() {
    return this.network.get(this.baseUrl + '/provincias', {});
  }

  localidades(filter) {
    return this.network.get(this.baseUrl + '/localidades', filter);
  }

  getOrganizaciones(usuario) {
    let params: any = {};
    if (usuario) {
      params.usuario = usuario;
    }
    return this.network.get(this.authUrl + '/organizaciones', params);
  }



}

