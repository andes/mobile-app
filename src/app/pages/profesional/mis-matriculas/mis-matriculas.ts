import { Component } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';
import * as moment from 'moment';
// providers
import { ProfesionalProvider } from 'src/providers/profesional';

@Component({
    selector: 'app-mis-matriculas',
    templateUrl: 'mis-matriculas.html',
    styleUrls: ['mis-matriculas.scss'],
})

export class MisMatriculasPage {
    inProgress = true;
    profesional: any = null;
    hoy = new Date();

    constructor(
        private router: Router,
        public authProvider: AuthProvider,
        private profesionalProvider: ProfesionalProvider) {
    }

    ionViewWillEnter() {
        const profesionalId = this.authProvider.user.profesionalId;
        this.profesionalProvider.getById(profesionalId).then((data: any) => {
            this.profesional = data[0];
            this.inProgress = false;
        });
    }

    detalleMatricula(formacionGrado) {
        if (formacionGrado.matriculacion) {
            this.profesionalProvider.formacionGradoSelected.next(formacionGrado);
            this.router.navigate(['/profesional/mis-matriculas-detalle']);
        } else {
            return false;
        }
    }

    esPeriodoRevalidacion(formacionGrado) {
        if (!formacionGrado.matriculacion?.length) {
            return false;
        }
        const fechaVencimiento = moment(formacionGrado.matriculacion[formacionGrado.matriculacion.length - 1].fin);
        return moment(this.hoy).isBetween(moment(fechaVencimiento).subtract(6, 'months'), fechaVencimiento, null, '[]');
    }
}






