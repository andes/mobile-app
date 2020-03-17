import { Component } from '@angular/core';
import { PacienteProvider } from './../../../../providers/paciente';
import { AuthProvider } from './../../../../providers/auth/auth';
import { NavParams } from 'ionic-angular';
import * as moment from 'moment/moment';                         
                            


@Component({
    selector: 'detalle-acceso-mi-huds',
    templateUrl: 'detalle-acceso-mi-huds.html',
})

export class DetalleAccesoMiHUDSPage {

    constructor(
        public pacienteProvider: PacienteProvider,
        public navParams: NavParams,
        public authProvider: AuthProvider) {
    }

    hideInfinite: Boolean;
    acceso;
    accesos = [];
    pacienteId;
    skip = 0;
    limit = 25;
    diffDias;

    ionViewDidLoad() {
        if (this.authProvider.user) {
            this.pacienteId = this.authProvider.user.pacientes[0].id;
        }
        this.acceso = this.navParams.get("acceso");
        this.diffDias = moment(new Date()).diff(this.acceso.fecha, 'days') + 1;  

    }
}
