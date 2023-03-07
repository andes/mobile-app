import { Component, OnInit } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';
import { ENV } from '@app/env';
import { ProfesionalProvider } from 'src/providers/profesional';
import { AlertController } from '@ionic/angular';
import { DescargaArchivosProvider } from 'src/providers/descarga-archivos';
import * as moment from 'moment';

@Component({
    selector: 'app-mis-matriculas-detalle',
    templateUrl: 'mis-matriculas-detalle.html',
    styleUrls: ['mis-matriculas.scss'],
})

export class MisMatriculasDetallePage implements OnInit {
    public isModalOpen = false;
    public hoy;
    public inProgress = false;
    public formacionGradoSelected: any;
    public profesional: any;
    public qrCodeStr: string = null;
    constructor(
        private router: Router,
        public alertController: AlertController,
        public authProvider: AuthProvider,
        private profesionalProvider: ProfesionalProvider,
        private descargaProvider: DescargaArchivosProvider) {
    }

    ngOnInit() {
        this.hoy = new Date();
        const profesionalId = this.authProvider.user.profesionalId;

        this.profesionalProvider.getById(profesionalId).then((data: any) => {
            this.profesional = data[0];
            this.inProgress = false;
            this.qrCodeStr = `${ENV.APP_URL}matriculaciones/guiaProfesional?documento=${this.profesional.documento}`;
            this.formacionGradoSelected = this.profesionalProvider.formacionGradoSelected.getValue();
        });
    }

    // True si la matricula está dentro de los próximos 6 meses a vencerse
    esPeriodoRevalidacion() {
        if (!this.formacionGradoSelected.matriculacion?.length) {
            return false;
        }
        const fechaVencimiento = moment(this.formacionGradoSelected.matriculacion[this.formacionGradoSelected.matriculacion.length - 1].fin);
        return moment(this.hoy).isBetween(moment(fechaVencimiento).subtract(6, 'months'), fechaVencimiento, null, '[]');
    }

    estadoMatricula() {
        if (!this.formacionGradoSelected.matriculacion?.length) {
            return;
        }
        const formacionGrado = this.formacionGradoSelected;

        if (!formacionGrado.renovacion && formacionGrado.matriculado) {
            const fechaVencimiento = new Date(formacionGrado.matriculacion[formacionGrado.matriculacion.length - 1].fin);
            if (this.hoy > fechaVencimiento) {
                return 'vencida';
            } else {
                return 'vigente';
            }
        }

        if (!formacionGrado.renovacion && !formacionGrado.matriculado) {
            return 'suspendida';
        }

        if (formacionGrado.renovacion) {
            if (formacionGrado.papelesVerificados) {
                return 'papelesVerificados';
            } else {
                return 'enTramite';
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
                        this.router.navigate(['/profesional/scan-profesional'], {
                            queryParams: { idFormacionGrado: this.formacionGradoSelected.id }
                        });
                    }
                },
                {
                    text: 'Cerrar',
                    handler: () => { }
                }
            ]
        });
        await confirm.present();
    }

    async descargarCredencial() {
        const qrcode = document.getElementById('parent');
        const imageData = this.getBase64Image(qrcode.firstChild.firstChild);
        const encodedData = btoa(imageData); // encode a string
        const parametros = `${this.profesional.id}/${this.formacionGradoSelected.id}/${encodedData}`;
        const nombreArchivo = `credencial ${this.profesional.apellido} - ${this.formacionGradoSelected.profesion.nombre} - ${moment().format('DD-MM-YYYY')}.pdf`;
        const pdfURL = 'modules/descargas/credencialProfesional';

        const uri = ENV.API_URL + `${pdfURL}/${parametros}` + '?token=' + this.authProvider.token;

        this.descargaProvider.descargarArchivo(uri, nombreArchivo);

    }

    getBase64Image(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        return dataURL;
    }

}






