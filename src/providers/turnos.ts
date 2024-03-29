import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
// providers
import { NetworkProvider } from './network';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { StorageService } from 'src/providers/storage-provider.service';

@Injectable()
export class TurnosProvider {
    public user: any;
    private baseUrl = ENV.API_URL;
    private ApiMobileUrl = ENV.API_MOBILE_URL;
    private turnoUrl = 'modules/mobileApp';
    private baseUrlCitas = 'modules/turnos';

    token: any;

    constructor(
        private network: NetworkProvider,
        private http: HttpClient,
        private storage: StorageService
    ) {

    }

    get(query) {
        const token = this.network.getToken();
        const headers = new HttpHeaders({ Authorization: 'JWT ' + token });
        const params = new HttpParams({ fromObject: query });
        const options = { headers, params };
        return this.http.get(this.baseUrl + this.turnoUrl + '/turnos', options);
    }

    getPrestacionesTurneables() {
        return this.network.get('prestaciones/turneables');
    }

    getUbicacionTurno(id) {
        const token = this.network.getToken();
        const headers = new HttpHeaders({ Authorization: 'JWT ' + token });
        const options = { headers };
        return this.http.get(this.baseUrl + this.turnoUrl + '/turnos/ubicacion/organizacion/' + id, options);
    }

    cancelarTurno(body) {
        const token = this.network.getToken();
        const headers = new HttpHeaders({ Authorization: 'JWT ' + token });
        const options = { headers };
        return this.http.post(this.baseUrl + this.turnoUrl + '/turnos/cancelar', body, options);

    }

    confirmarTurno(body) {
        return this.network.post(this.baseUrl + '/turnos/confirmar', body, {});
    }

    obtenerTurno(body) {
        return this.network.post(this.baseUrl + '/turnos/obtener', body, {});
    }

    confirmarAsistenciaTurno(body) {
        return this.network.post(this.baseUrl + '/turnos/asistencia', body, {});
    }

    getHistorial(params: any) {
        const token = this.network.getToken();
        const headers = new HttpHeaders({ Authorization: 'JWT ' + token });
        const options = { headers, params };
        return this.http.get(this.baseUrl + this.baseUrlCitas + '/historial', options);

    }
}
