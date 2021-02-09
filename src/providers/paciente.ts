import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ENV } from '@app/env';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class PacienteProvider {
  public paciente: any;
  public familiar: any;
  private baseUrl = ENV.API_URL;
  private mobileUrl = 'modules/mobileApp';
  private hudsUrl = 'modules/huds/accesos';

  constructor(
    private network: NetworkProvider,
    private storage: Storage,
    private http: HttpClient
  ) {

  }

  async get(id) {
    await this.storage.get('familiar').then((value) => {
      this.familiar = value;
    });
    if (this.familiar) {
      return this.network.get(this.mobileUrl + '/paciente/' + id + '/relaciones', {}).then((paciente) => {
        this.paciente = paciente;
        return Promise.resolve(paciente);
      }).catch(err => Promise.reject(err));
    } else {
      return this.network.get(this.mobileUrl + '/paciente/' + id, {}).then((paciente) => {
        this.paciente = paciente;
        return Promise.resolve(paciente);
      }).catch(err => Promise.reject(err));
    }
  }

  relaciones(params) {
    return this.network.get(this.mobileUrl + '/relaciones', params);
  }

  laboratorios(id, extras) {
    return this.network.get(this.mobileUrl + '/laboratorios/' + id, extras);
  }

  huds(id, expresionSnomed) {
    return this.network.get('modules/rup/prestaciones/huds/' + id + '?expresion=' + expresionSnomed);
  }

  update(id, data) {
    return this.network.put(this.mobileUrl + '/paciente/' + id, data, {});
  }

  patch(id, data) {
    return this.network.patch(this.mobileUrl + '/pacientes/' + id, data, {});
  }

  restablecerPassword(email, data) {
    return this.network.post(this.mobileUrl + '/restablecer-password', data).then((paciente) => {
      this.paciente = paciente;
      return Promise.resolve(paciente);
    }).catch(err => Promise.reject(err));
  }

  getAccesosHUDS(pacienteId, skip, limit) {
    const token = this.network.getToken();
    const headers = new HttpHeaders({ Authorization: 'JWT ' + token });
    const params = new HttpParams({ fromObject: { paciente: pacienteId, skip, limit } });
    const options = { headers, params };
    return this.http.get(`${this.baseUrl}${this.hudsUrl}`, options);
  }
}

