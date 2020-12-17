import { Component, OnInit } from '@angular/core';
import { PacienteProvider } from '../../../providers/paciente';
import { AuthProvider } from '../../../providers/auth/auth';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mis-familiares',
    templateUrl: './mis-familiares.page.html',
    styleUrls: ['./mis-familiares.page.scss'],
})

export class MisFamiliaresPage implements OnInit {

    relaciones: any = null;
    user: any;
    familiar = false;

    // tslint:disable-next-line: use-life-cycle-interface
    ngOnInit() {
        this.getRelaciones();
    }

    constructor(
        public storage: Storage,
        public navCtrl: NavController,
        public pacienteProvider: PacienteProvider,
        public router: Router,
        public auth: AuthProvider) {

    }


    getRelaciones() {
        this.storage.get('familiar').then((value) => {
            let idPaciente;
            if (value) {
                this.user = value;
                this.familiar = true;
                idPaciente = this.user.referencia;
            } else {
                this.user = this.auth.user;
                idPaciente = this.user.pacientes[0].id;
            }
            this.pacienteProvider.relaciones({ id: idPaciente }).then((data: any) => {
                this.relaciones = data;
            });
        });

    }

    verRelacion(relacion) {
        if (relacion.relacion.nombre === 'hijo/a') {
            this.storage.set('familiar', relacion);
        } else {
            this.storage.set('familiar', '');
        }
        this.router.navigateByUrl('home');
        //this.navCtrl.setRoot(HomePage);
    }
}