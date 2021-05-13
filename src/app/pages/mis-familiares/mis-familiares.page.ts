import { Component } from '@angular/core';
import { PacienteProvider } from '../../../providers/paciente';
import { AuthProvider } from '../../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
    selector: 'app-mis-familiares',
    templateUrl: './mis-familiares.page.html',
    styleUrls: ['./mis-familiares.page.scss'],
})

export class MisFamiliaresPage {

    relaciones: any = null;
    user: any;
    public familiar = false;
    public loading = false;

    // tslint:disable-next-line: use-life-cycle-interface
    ionViewWillEnter() {
        this.getRelaciones();
    }

    constructor(
        private storage: Storage,
        private pacienteProvider: PacienteProvider,
        private router: Router,
        public auth: AuthProvider) {
    }

    getRelaciones() {
        this.loading = true;
        this.storage.get('familiar').then((value) => {
            let idPaciente;
            if (value) {
                this.user = value;
                this.familiar = true;
                idPaciente = this.user.referencia;
                this.relaciones = [this.auth.user];
                this.loading = false;
            } else {
                this.user = this.auth.user;
                idPaciente = this.user.pacientes[0].id;
                this.pacienteProvider.relaciones({ id: idPaciente }).then((data: any) => {
                    this.relaciones = data;
                    this.loading = false;
                });
            }
        });

    }

    verRelacion(relacion) {
        if (relacion.relacion && relacion.relacion.nombre === 'hijo/a') {
            this.storage.set('familiar', relacion);
            this.router.navigateByUrl('home');
        } else {
            this.storage.set('familiar', '');
        }
    }

    registrarFamiliar() {
        this.router.navigate(['/mis-familiares/registro-familiar']);
    }

    registrarFamiliar() {
        this.router.navigate(['/mis-familiares/registro-familiar']);
    }
}
