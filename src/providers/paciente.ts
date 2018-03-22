import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class PacienteProvider {
  public paciente: any;
  private baseUrl = 'modules/mobileApp';

  constructor(
    public network: NetworkProvider
  ) {
  }

  get (id) {
    return this.network.get(this.baseUrl + '/paciente/' + id, { }).then((paciente) => {
      this.paciente = paciente;
      return Promise.resolve(paciente);
    }).catch(err => Promise.reject(err));
  }

  laboratorios (id, extras) {
    return this.network.get(this.baseUrl + '/laboratorios/' + id, extras);
  }

  update (id, data) {
    return this.network.put(this.baseUrl + '/paciente/' + id, data, {});
  }

  patch (id, data) {
    return this.network.patch(this.baseUrl + '/pacientes/' + id, data, {});
  }

  restablecerPassword (email, data) {
    return this.network.post(this.baseUrl + '/restablecer-password', data).then((paciente) => {
      this.paciente = paciente;
      return Promise.resolve(paciente);
    }).catch(err => Promise.reject(err));
  }
}

