import { Component, OnInit } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { ActivatedRoute } from '@angular/router';

import { ProfesionalProvider } from 'src/providers/profesional';

@Component({
    selector: 'app-mis-matriculas-detalle',
    templateUrl: 'mis-matriculas-detalle.html',
    styleUrls: ['mis-matriculas.scss'],
})

export class MisMatriculasDetallePage implements OnInit {
    hoy;
    inProgress = false;
    formacionGrado: any;
    profesional: any;
    constructor(
        private router: ActivatedRoute,
        public authProvider: AuthProvider,
        private profesionalProvider: ProfesionalProvider) {
    }

    ngOnInit() {
        this.hoy = new Date();
        let profesionalId;
        profesionalId = this.authProvider.user.profesionalId;

        this.profesionalProvider.getById(profesionalId).then((data: any) => {
            this.profesional = data[0];
            this.inProgress = false;
        });

        this.router.queryParams.subscribe(params => {
            this.formacionGrado = JSON.parse(params.formacionGrado);
        });
    }

    estadoMatricula() {
        const formacionGrado = this.formacionGrado;
        if (formacionGrado.matriculacion?.length && !formacionGrado.renovacion && formacionGrado.matriculado) {
            if (this.hoy > formacionGrado.matriculacion[formacionGrado.matriculacion.length - 1].fin) {
                return 'vencida';
            } else {
                return 'vigente';
            }
        }

        if (formacionGrado.matriculacion?.length && !formacionGrado.renovacion && !formacionGrado.matriculado) {
            return 'suspendida';
        }

        if (formacionGrado.matriculacion?.length && formacionGrado.renovacion) {
            if (formacionGrado.papelesVerificados) {
                return 'papelesVerificados';
            } else {
                return 'papelesSinVerificar';
            }
        }
    }
}






