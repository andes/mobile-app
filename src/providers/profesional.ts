import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class ProfesionalProvider {
    private baseUrl = 'core/tm';
    public formacionGradoSelected = new BehaviorSubject<any>(null);

    constructor(
        public network: NetworkProvider) {
    }

    getById(id: string) {
        return this.network.get(this.baseUrl + '/profesionales/?id=' + id, {});
    }

    getProvincias() {
        return this.network.get(this.baseUrl + '/provincias', {});
    }

    getProvincia(provincia: any) {
        return this.network.get(this.baseUrl + '/provincias', provincia);
    }

    getLocalidades(provincia: string) {
        return this.network.get(this.baseUrl + '/localidades?provincia=' + provincia, {});
    }

    getProfesionalFirma(id: string) {
        return this.network.get(this.baseUrl + '/profesionales/firma/?id=' + id, {});
    }

    getProfesionalFoto(id: string) {
        return this.network.get(this.baseUrl + '/profesionales/foto/?id=' + id, {});
    }

    putProfesional(profesionalModel) {
        return this.network.put(this.baseUrl + '/profesionales/actualizar', profesionalModel);
    }

    saveProfesional(profesionalModel: any) {
        return this.network.post(this.baseUrl + '/profesionales/', profesionalModel);
    }

    validarProfesional(body) {
        return this.network.post(this.baseUrl + '/profesionales/validar', body);
    }

    patchProfesional(id: string, cambios) {
        return this.network.patch(this.baseUrl + '/profesionales/' + id, cambios);
    }

    updateProfesional(id: string, cambios) {
        return this.network.patch(this.baseUrl + '/profesionales/update/' + id, cambios);
    }
}
