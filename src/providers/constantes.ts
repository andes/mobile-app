import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class ConstanteProvider {
    public organizaciones: any;

    private baseUrl = 'core/tm';
    private authUrl = 'auth';
    private urlConstantes = 'modules/constantes';

    public motivosSuspensionTurno = [
        { id: 'profesional', mensaje: 'Decidido por el Equipo de Salud' },
        { id: 'organizacion', mensaje: 'Decidido por el Centro de Atención' },
        { id: 'edilicia', mensaje: 'Problemas edillicios' }
    ] as const;

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

    getOrganizaciones() {
        return this.network.get(this.authUrl + '/organizaciones', {});
    }

    getMotivoSuspension(motivo) {
        return this.motivosSuspensionTurno.find(x => x.id === motivo)?.mensaje;
    }

    getGeneros() {
        return this.network.get(this.urlConstantes, { source: 'mpi:genero' });
    }

}

