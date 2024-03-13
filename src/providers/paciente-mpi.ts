import { Injectable } from '@angular/core';
// providers
import { NetworkProvider } from './network';

@Injectable()
export class PacienteMPIService {

    constructor(private network: NetworkProvider) { }
    private pacienteUrl = 'core-v2/mpi/pacientes'; // URL to web api

    get(params) {
        return this.network.get(this.pacienteUrl, params);
    }

    getById(id: string) {
        return this.network.get(this.pacienteUrl + '/' + id, {});
    }

    save(paciente) {
        if (paciente.id) {
            return this.network.patch(this.pacienteUrl + '/' + paciente.id, paciente);
        } else {
            return this.network.post(this.pacienteUrl, paciente);
        }
    }

}
