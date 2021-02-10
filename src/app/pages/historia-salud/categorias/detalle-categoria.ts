import { Component, OnInit } from '@angular/core';
import { Downloader } from '@ionic-native/downloader/ngx';
import { DownloadRequest, NotificationVisibility } from '@ionic-native/downloader';
import { AlertController } from '@ionic/angular';
import { PacienteProvider } from 'src/providers/paciente';
import { AuthProvider } from 'src/providers/auth/auth';
import { ENV } from '@app/env';
import * as moment from 'moment/moment';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';

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
    ) { }

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
                console.log(elementoAdjuntos);
                const uri = ENV.API_URL + 'modules/rup/store/' +
                    elementoAdjuntos.valor.documentos[0].id + '?token=' + this.authProvider.token;

                const request: DownloadRequest = {
                    uri,
                    title: `${elementoAdjuntos.valor.documentos[0].id}.${elementoAdjuntos.valor.documentos[0].ext}`,
                    description: `Descarga de ${this.categoria.titulo}`,
                    mimeType: '',
                    visibleInDownloadsUi: true,
                    notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
                    destinationInExternalFilesDir: {
                        dirType: 'Downloads',
                        subPath: `${elementoAdjuntos.valor.documentos[0].id}.${elementoAdjuntos.valor.documentos[0].ext}`
                    }
                };

                new Downloader().download(request)
                    .then((location: string) => console.log('Documento descargado en:' + location))
                    .catch((error: any) => console.error(error));


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

    poseeAdjunto(registro) {
        return this.categoria.descargaAdjuntos && this.getAdjunto(registro);
    }

    private getAdjunto(registro) {
        return registro.registro.registros.find(x => x.nombre === 'documento adjunto');
    }

}
