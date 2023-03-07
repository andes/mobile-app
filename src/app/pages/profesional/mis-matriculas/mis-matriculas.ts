import { Component, OnInit } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';
// providers
import { ProfesionalProvider } from 'src/providers/profesional';

@Component({
    selector: 'app-mis-matriculas',
    templateUrl: 'mis-matriculas.html',
    styleUrls: ['mis-matriculas.scss'],
})

export class MisMatriculasPage implements OnInit {
    inProgress = false;
    profesional: any;
    hoy;

    constructor(
        private router: Router,
        public authProvider: AuthProvider,
        private profesionalProvider: ProfesionalProvider) {
    }

    ngOnInit() {
        this.inProgress = true;
        this.hoy = new Date();
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
}






