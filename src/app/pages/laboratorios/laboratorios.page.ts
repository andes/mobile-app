import { Component, OnInit } from '@angular/core';
import { AuthProvider } from './../../../providers/auth/auth';
import { AlertController } from '@ionic/angular';
import { PacienteProvider } from '../../../providers/paciente';
import * as moment from 'moment';
import { ENV } from '@app/env';
import { StorageService } from 'src/providers/storage-provider.service';
import { ErrorReporterProvider } from '../../../providers/library-services/errorReporter';
import { DescargaArchivosProvider } from 'src/providers/library-services/descarga-archivos';
import { ToastProvider } from '../../../providers/toast';

interface CDA {
    fecha: Date;
    prestacion: string;
    organizacion: string;
    codigoDeConfidencialidad: string;
    idProtocolo: string;
    adjuntos: any[];
}


function formatCDA(cda): CDA {
    return {
        fecha: moment(cda.fecha).toDate(),
        prestacion:
            cda?.prestacion?.snomed?.term ||
            `Informe de laboratorio: Protocolo ${cda.numero}`,
        organizacion: cda.organizacion
            ? cda.organizacion
            : cda.efectorSolicitante,
        codigoDeConfidencialidad: cda.confidentialityCode
            ? cda.confidentialityCode
            : cda.codigoHIV,
        idProtocolo: cda.idProtocolo,
        adjuntos: cda.adjuntos,
    };
}

function formatDateForSIL2(fecha: moment.MomentInput): string {
    return moment(fecha).format('YYYYMMDD');
}

@Component({
    selector: 'app-laboratorios',
    templateUrl: './laboratorios.page.html',
    styleUrls: ['laboratorios.page.scss'],
})
export class LaboratoriosPage implements OnInit {
    cdas: CDA[] = [];
    familiar: any = false;
    fechaHasta: string;
    fechaDesde: string;
    maxDate: string;
    loading = false;

    pickerOptions = {
        cssClass: '.picker'
    };

    constructor(
        private storage: StorageService,
        private pacienteProvider: PacienteProvider,
        private authProvider: AuthProvider,
        private alertCtrl: AlertController,
        private reporter: ErrorReporterProvider,
        private descargaProvider: DescargaArchivosProvider,
        private toastProvider: ToastProvider
    ) { }

    ngOnInit() {
        this.fechaHasta = moment().toISOString();
        this.fechaDesde = moment().subtract(60, 'days').toISOString();
        this.maxDate = moment().endOf('day').toISOString();
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            this.getCDAS();
        });
    }

    async getCDAS() {
        this.loading = true;
        this.cdas = [];
        try {
            if (this.authProvider.user) {
                let idPaciente;
                if (this.familiar) {
                    idPaciente = this.familiar.id;
                } else {
                    idPaciente = this.authProvider.user.pacientes[0].id;
                }
                const paciente: any = await this.pacienteProvider.get(
                    idPaciente
                );

                const sil2Params = {
                    pacienteId: idPaciente,
                    fechaDesde: formatDateForSIL2(this.fechaDesde),
                    fechaHasta: formatDateForSIL2(this.fechaHasta)
                };

                const promiseLaboratorios = this.pacienteProvider
                    .laboratorios(idPaciente, { fechaDesde: this.fechaDesde, fechaHasta: this.fechaHasta })
                    .then((cdas: any[]) => cdas.map((item) => formatCDA(item)));

                const promiseLaboratoriosSil2 = this.pacienteProvider
                    .sil2laboratorios(sil2Params)
                    .then((labs: any[]) => {
                        const data = labs[0]?.['Data'];
                        if (data) {
                            return data.map((item) => formatCDA(item));
                        }
                        return [];
                    });

                // Esperar a que ambas promesas se resuelvan
                const [resultLaboratorios, resultLaboratoriosSil2] =
                    await Promise.all([
                        promiseLaboratorios,
                        promiseLaboratoriosSil2,
                    ]);

                this.cdas = resultLaboratorios.concat(resultLaboratoriosSil2);
                this.cdas = this.cdas.sort((a, b) => {
                    return (
                        moment(b.fecha).valueOf() - moment(a.fecha).valueOf()
                    );
                });
            }
        } catch (error) {
            await this.toastProvider.danger(
                'Error al obtener laboratorios del paciente'
            );
        } finally {
            this.loading = false;
        }
    }

    async downloadFile(cda: CDA) {
        const tipo = 'pdf';
        if (cda.idProtocolo) {
            const url = ENV.API_URL + 'modules/descargas/laboratorio/pdf';
            this.descargaProvider.abrirArchivoDesdeRuta(
                url,
                {
                    protocolo: {
                        data: {
                            idProtocolo: cda.idProtocolo,
                        },
                    },
                },
                `${cda.idProtocolo}.${tipo}`
            );
        } else {
            if (cda.codigoDeConfidencialidad !== 'R') {
                const url =
                    ENV.API_URL +
                    'modules/cda/' +
                    cda.adjuntos[0] +
                    '?token=' +
                    this.authProvider.token;
                this.descargaProvider.descargarArchivo(
                    url,
                    `${cda.prestacion}.${tipo}`
                );
            } else {
                const alert = await this.alertCtrl.create({
                    header: 'Atención',
                    subHeader:
                        'Este resultado debe ser retirado personalmente por el establecimiento de salud.',
                    buttons: ['Entiendo'],
                });
                await alert.present();
            }
        }
    }

    onBugReport() {
        this.reporter.report();
    }
}
