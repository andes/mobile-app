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
        this.hoy = new Date();
        let profesionalId;
        this.inProgress = true;
        profesionalId = this.authProvider.user.profesionalId;
        this.profesionalProvider.getById(profesionalId).then((data: any) => {
            this.profesional = data[0];
            this.inProgress = false;
        });
    }

    estadoMatricula(i) {
        const formacionGrado = this.profesional.formacionGrado[i];
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

    detalleMatricula(formacionGrado) {
        if (formacionGrado.matriculacion) {
            const profesional = {
                apellido: this.profesional.apellido,
                nombre: this.profesional.nombre
            };
            this.router.navigate(['/profesional/mis-matriculas-detalle'], {
                queryParams: { formacionGrado: JSON.stringify(formacionGrado) }
            });
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
                        if (this.hoy > formacionPosgrado.matriculacion[formacionPosgrado.matriculacion.length - 1].fin) {
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






