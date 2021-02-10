import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { PacienteProvider } from './../../../../providers/paciente';
import { AuthProvider } from './../../../../providers/auth/auth';
import * as moment from 'moment/moment';
@Component({
    // tslint:disable-next-line: component-selector
    selector: 'detalle-acceso-mi-huds',
    templateUrl: 'detalle-acceso-mi-huds.html',
})

export class DetalleAccesoMiHUDSPage implements OnInit {

    constructor(
        private storage: Storage,
        public pacienteProvider: PacienteProvider,
        public authProvider: AuthProvider
    ) {
    }

    hideInfinite: boolean;
    acceso;
    accesos = [];
    pacienteId;
    skip = 0;
    limit = 25;
    diffDias;
    familiar: any = false;

    ngOnInit() {
        this.storage.get('accesoHuds').then((value) => {
            this.acceso = value;

            if (this.authProvider.user) {
                this.pacienteId = this.authProvider.user.pacientes[0].id;
            }
            this.diffDias = moment(new Date()).diff(this.acceso.fecha, 'days') + 1;
        });

    }
}
