import { Injectable } from '@angular/core';
// providers
import { NetworkProvider } from './network';

@Injectable()
export class PacienteMPIService {

    constructor(private network: NetworkProvider) { }
    private pacienteUrl = 'core/mpi/pacientes';  // URL to web api

    get(params) {
        return this.network.get(this.pacienteUrl, params);
    }

    /**
     * Metodo getById. Trae un objeto paciente por su Id.
     * @param  id Busca por Id
     */
    getById(id: string) {
        return this.network.get(this.pacienteUrl + '/' + id, {});
    }

    save(paciente) {
        if (paciente.id) {
            return this.network.put(this.pacienteUrl + '/' + paciente.id, paciente);
        } else {
            return this.network.post(this.pacienteUrl, paciente);

        }
    }

}
