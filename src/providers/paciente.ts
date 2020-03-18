import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class PacienteProvider {
  public paciente: any;
  public familiar: boolean;
  private baseUrl = 'modules/mobileApp';

  constructor(
    public network: NetworkProvider,
    public storage: Storage
  ) {

  }

  async get(id) {
    await this.storage.get('familiar').then((value) => {
      if (value) {
        this.familiar = true;
      } else {
        this.familiar = false;
      }
    });
    return this.network.get(this.baseUrl + '/paciente/' + id, { familiar: this.familiar }).then((paciente) => {
      this.paciente = paciente;
      return Promise.resolve(paciente);
    }).catch(err => Promise.reject(err));
  }

  relaciones(params) {
    return this.network.get(this.baseUrl + '/relaciones', params);
  }

  laboratorios(id, extras) {
    return this.network.get(this.baseUrl + '/laboratorios/' + id, extras);
  }

  update(id, data) {
    return this.network.put(this.baseUrl + '/paciente/' + id, data, {});
  }

  patch(id, data) {
    return this.network.patch(this.baseUrl + '/pacientes/' + id, data, {});
  }

  restablecerPassword(email, data) {
    return this.network.post(this.baseUrl + '/restablecer-password', data).then((paciente) => {
      this.paciente = paciente;
      return Promise.resolve(paciente);
    }).catch(err => Promise.reject(err));
  }
}

