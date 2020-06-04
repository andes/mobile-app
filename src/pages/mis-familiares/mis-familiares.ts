import { Component } from '@angular/core';
import { PacienteProvider } from '../../providers/paciente';
import { AuthProvider } from '../../providers/auth/auth';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// pages
import { HomePage } from '../home/home';

@Component({
    selector: 'mis-familiares',
    templateUrl: 'mis-familiares.html',
})

export class MisFamiliaresPage {

    relaciones: any = null;
    user: any;

    // tslint:disable-next-line: use-life-cycle-interface
    ngOnInit() {
        this.getRelaciones();
    }

    constructor(
        public storage: Storage,
        public navCtrl: NavController,
        public pacienteProvider: PacienteProvider,
        public auth: AuthProvider) {

    }


    getRelaciones() {
        this.storage.get('familiar').then((value) => {
            let idPaciente;
            if (value) {
                this.user = value;
                idPaciente = this.user.referencia;
            } else {
                this.user = this.auth.user;
                idPaciente = this.user.pacientes[0].id;
            }
            this.pacienteProvider.relaciones({ id: idPaciente }).then((data: any) => {
                this.relaciones = data;
            })
        });

    }

    verRelacion(relacion) {
        if (relacion.relacion.nombre === 'hijo/a') {
            this.storage.set('familiar', relacion);
        } else {
            this.storage.set('familiar', '');
        }
        this.navCtrl.setRoot(HomePage);
    }
}

