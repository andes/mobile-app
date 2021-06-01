import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { PacienteProvider } from 'src/providers/paciente';
import { AuthProvider } from 'src/providers/auth/auth';
import { ENV } from '@app/env';
import * as moment from 'moment/moment';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileTransferObject } from '../../../../../node_modules/@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener/ngx';
@Component({
    selector: 'app-detalle-categoria',
    templateUrl: 'detalle-categoria.html',
})

export class DetalleCategoriaPage implements OnInit {
    familiar: any = false;
    public categoria;
    public registros;
    constructor(
        private authProvider: AuthProvider,
        private pacienteProvider: PacienteProvider,
        private route: ActivatedRoute,
        private alertCtrl: AlertController,
        private storage: Storage,
        private transfer: FileTransfer,
        private platform: Platform,
        public loadingController: LoadingController) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.categoria = JSON.parse(params.categoria);
            this.storage.get('familiar').then((value) => {
                if (value) {
                    this.familiar = value;
                }
                if (this.authProvider.user) {
                    let pacienteId;
                    if (this.familiar) {
                        pacienteId = this.familiar.id;
                    } else {
                        pacienteId = this.authProvider.user.pacientes[0].id;
                    }
                    this.pacienteProvider.huds(pacienteId, this.categoria.expresionSnomed).then((registros: any[]) => {
                        this.registros = registros;
                    });
                }
            });
        });
    }

    fecha(registro) {
        return moment(registro.fecha).format('DD [de] MMMM [del] YYYY');
    }

    async abrirAdjunto(registro) {
        if (this.categoria.descargaAdjuntos) {
            const elementoAdjuntos = this.getAdjunto(registro);
            if (elementoAdjuntos && elementoAdjuntos.valor.documentos[0]) {
                const url = ENV.API_URL + 'modules/rup/store/' +
                    elementoAdjuntos.valor.documentos[0].id + '?token=' + this.authProvider.token;
                window.open(url);
            } else {
                const alert = await this.alertCtrl.create({
                    header: 'Sin adjuntos',
                    subHeader: 'No existe un archivo asociado al certificado',
                    buttons: ['Cerrar']
                });
                await alert.present();
            }
        }
    }

    async descargarPrestacion(registro) {
        const data = {
            idRegistro: registro.registro.id,
            idPrestacion: registro.idPrestacion
        };
        const tipo = 'pdf';
        const pdfURL = 'modules/descargas';
        const url1 = ENV.API_URL + `${pdfURL}/${tipo}/${data.idPrestacion}/${data.idRegistro}` + '?token=' + this.authProvider.token;
        this.open(url1);
    }

    private getAdjunto(registro) {
        return registro.registro.registros.find(x => x.nombre === 'documento adjunto');
    }

    open(url) {
        if (this.platform.is('cordova')) {
            const fileTransfer: FileTransferObject = this.transfer.create();
            const localFile = `${File.dataDirectory}certificado.pdf`;
            fileTransfer.download(url, localFile, true).then((entry) => {
                new FileOpener().showOpenWithDialog(entry.toURL(), '')
                .then(() => {
                    // this.loadingController.dismiss();
                })
                .catch(e => {
                    console.error('Error al abrir el archivo', e);
                    this.loadingController.dismiss();
                });
            }, (error: any) => {
                console.error('error', error);
            });
        } else {
            window.open(url);
        }
    }

    abrir(registro) {
        // Si posee adjuntos los levanta en el navegador, sino descarga la prestación y da opciones al usuario para la visualizacion
        if (this.categoria.descargaAdjuntos && this.getAdjunto(registro)){
            this.abrirAdjunto(registro);
        } else {
            this.descargarPrestacion(registro);
        }
    }

}
