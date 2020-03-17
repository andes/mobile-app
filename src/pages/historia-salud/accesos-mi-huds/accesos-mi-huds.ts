import { Component } from '@angular/core';
import { PacienteProvider } from './../../../providers/paciente';
import { AuthProvider } from './../../../providers/auth/auth';
import { NavController } from 'ionic-angular';
import { DetalleAccesoMiHUDSPage } from './detalle-acceso-mi-huds/detalle-acceso-mi-huds';

@Component({
    selector: 'accesos-mi-huds',
    templateUrl: 'accesos-mi-huds.html',
})

export class AccesosMiHUDSPage {

    constructor(
        public navCtrl: NavController,
        public pacienteProvider: PacienteProvider,
        public authProvider: AuthProvider) {
    }

    hideInfinite: Boolean;
    accesos = [];
    pacienteId;
    skip = 0;
    limit = 25;

    ionViewDidLoad() {
        if (this.authProvider.user) {
            this.pacienteId = this.authProvider.user.pacientes[0].id;
            this.loadData();
        }
    }

    loadData(infiniteScroll?: any) {
        this.pacienteProvider.getAccesosHUDS(this.pacienteId, this.skip, this.limit).then((data: any[]) => {
            if(!data || !data[0]) {
                this.hideInfinite = true;
            } else {
                Array.prototype.push.apply(this.accesos, data);
                this.skip += this.accesos.length;
            }
        });
        setTimeout(() => {
            if(infiniteScroll) {
                infiniteScroll.complete();
            }
        }, 500);
    }

    verDetalleAccesoMiHUDS(_acceso) {
        this.navCtrl.push(DetalleAccesoMiHUDSPage, { acceso: _acceso });
    }
}
