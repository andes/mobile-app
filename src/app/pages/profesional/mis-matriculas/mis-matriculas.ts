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

    estadoMatricula(i) {
        const formacionGrado = this.profesional.formacionGrado[i];
        const fechaVencimiento = new Date(formacionGrado.matriculacion[formacionGrado.matriculacion.length - 1].fin);
        if (formacionGrado.matriculacion?.length && !formacionGrado.renovacion && formacionGrado.matriculado) {
            if (this.hoy > fechaVencimiento) {
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
                return 'EnTramite';
            }
        }
    }

    detalleMatricula(formacionGrado) {
        if (formacionGrado.matriculacion) {
            this.profesionalProvider.formacionGradoSelected.next(formacionGrado);
            this.router.navigate(['/profesional/mis-matriculas-detalle']);
        } else {
            return false;
        }
    }

    verificarFecha(i) {
        const formacionPosgrado = this.profesional.formacionPosgrado[i];
        if (formacionPosgrado.matriculacion.length) {
            if (formacionPosgrado.revalida) {
                return 'revalida';
            } else {
                if (!formacionPosgrado.matriculado) {
                    return 'suspendida';
                } else {
                    if (!formacionPosgrado.tieneVencimiento) {
                        return 'sinVencimiento';
                    } else {
                        const fechaVencimiento = new Date(formacionPosgrado.matriculacion[formacionPosgrado.matriculacion.length - 1].fin);
                        if (this.hoy > fechaVencimiento) {
                            return 'vencida';
                        } else {
                            return 'vigente';
                        }
                    }
                }
            }
        }
    }

    estaVencida(i) {
        const formacionPosgrado = this.profesional.formacionPosgrado[i];
        const fin = new Date(formacionPosgrado.matriculacion[formacionPosgrado.matriculacion.length - 1].fin);
        return ((this.hoy.getTime() - fin.getTime()) / (1000 * 3600 * 24) > 365);
    }
}






