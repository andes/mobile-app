import { Component, OnInit } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { ActivatedRoute, Router } from '@angular/router';

import { ProfesionalProvider } from 'src/providers/profesional';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-mis-matriculas-detalle',
    templateUrl: 'mis-matriculas-detalle.html',
    styleUrls: ['mis-matriculas.scss'],
})

export class MisMatriculasDetallePage implements OnInit {
    isModalOpen = false;
    hoy;
    inProgress = false;
    formacionGrado: any;
    profesional: any;
    public qrCodeStr: string = null;
    constructor(
        private router: ActivatedRoute,
        private route: Router,
        public alertController: AlertController,
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
            this.qrCodeStr = 'https://app.andes.gob.ar/matriculaciones/guiaProfesional?documento=' + this.profesional.documento;
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
                return 'EnTramite';
            }
        }
    }

    irInstrucciones() {
        this.instruccionesModal();
    }

    private async instruccionesModal() {
        const confirm = await this.alertController.create({
            header: '¿Qué necesito para renovar una matrícula?',
            message: '<ul>' + '<li>DNI en mano para escanear</li><li>Cámara frontal habilitada</li><li>Comprobante de pago en pdf o imágen</li><li>Conexión de internet</li>' + '</ul>',
            buttons: [
                {
                    text: 'Renovar matrícula',
                    handler: () => {
                        this.route.navigate(['/profesional/scan-profesional'], {});
                    }
                },
                {
                    text: 'Cerrar',
                    handler: () => {
                        // resolve();
                    }
                }
            ]
        });
        await confirm.present();
    }
}






