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
            if (value) {
                this.user = value;
            } else {
                this.user = this.auth.user;
            }
            this.pacienteProvider.relaciones({ documento: this.user.documento }).then((data: any) => {
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

