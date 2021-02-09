import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from './../../../../providers/paciente';
import { AuthProvider } from './../../../../providers/auth/auth';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'accesos-mi-huds',
    templateUrl: 'accesos-mi-huds.html',
})

export class AccesosMiHUDSPage {

    constructor(
        private router: Router,
        private storage: Storage,
        public pacienteProvider: PacienteProvider,
        public authProvider: AuthProvider
    ) {
    }

    hideInfinite: boolean;
    accesos$: Observable<any>;
    pacienteId;
    skip = 0;
    limit = 25;
    familiar: any = false;

    ionViewDidEnter() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
        });
        if (this.authProvider.user) {
            this.pacienteId = this.authProvider.user.pacientes[0].id;
            this.loadData();
        }
    }

    loadData(infiniteScroll?: any) {
        this.accesos$ = this.pacienteProvider.getAccesosHUDS(this.pacienteId, this.skip, this.limit).pipe(
            tap((data: any[]) => {
                if (!data || !data[0]) {
                    this.hideInfinite = true;
                } else {
                    this.skip += data.length;
                    return data;
                }
            }));
        setTimeout(() => {
            if (infiniteScroll) {
                infiniteScroll.complete();
            }
        }, 500);
    }

    verDetalleAccesoMiHUDS(acceso) {
        this.storage.set('accesoHuds', acceso).then(() => {
            this.router.navigate(['historia-salud/detalle-huds']);
        });
    }
}