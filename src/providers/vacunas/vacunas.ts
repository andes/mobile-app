import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
// providers
import { NetworkProvider } from './../network';

@Injectable()
export class VacunasProvider {
    public user: any;
    private baseUrl = 'modules/vacunas';

    constructor(
        private network: NetworkProvider) {
    }

    getByPaciente(idPaciente) {
        return this.network.get(`${this.baseUrl}/paciente/${idPaciente}`, {});
    }

}
