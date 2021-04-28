import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class PacienteProvider {
    public paciente: any;
    public familiar: any;
    private baseUrl = 'modules/mobileApp';

    constructor(
        private network: NetworkProvider,
        private storage: Storage
    ) {

    }

    async get(id) {
        await this.storage.get('familiar').then((value) => {
            this.familiar = value;
        });
        if (this.familiar) {
            return this.network.get(this.baseUrl + '/paciente/' + id + '/relaciones', {}).then((paciente) => {
                this.paciente = paciente;
                return Promise.resolve(paciente);
            }).catch(err => Promise.reject(err));
        } else {
            return this.network.get(this.baseUrl + '/paciente/' + id, {}).then((paciente) => {
                this.paciente = paciente;
                return Promise.resolve(paciente);
            }).catch(err => Promise.reject(err));
        }
    }

    relaciones(params) {
        return this.network.get(this.baseUrl + '/relaciones', params);
    }

    laboratorios(id, extras) {
        return this.network.get(this.baseUrl + '/laboratorios/' + id, extras);
    }

    huds(id, expresionSnomed) {
        return this.network.get('modules/rup/prestaciones/huds/' + id + '?expresion=' + expresionSnomed);
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

    registro(paciente) {
        return this.network.post(`${this.baseUrl}/registro`, paciente);
    }
}

