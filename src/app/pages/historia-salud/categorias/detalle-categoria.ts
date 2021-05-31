import { Component, OnInit } from '@angular/core';
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
        private storage: Storage) { }

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

    async prueba(registro) {
        console.log('REGISTRO ', registro.registro);
        const data = {
            idRegistro: registro.registro.id,
            idPrestacion: registro.idPrestacion
        };
        console.log('idRegistro ', data.idRegistro);
        const tipo = 'pdf';
        const pdfURL = 'modules/descargas';
        const url1 = ENV.API_URL + `${pdfURL}/${tipo}/${data.idPrestacion}/${data.idRegistro}` + '?token=' + this.authProvider.token;
        window.open(url1);
    }

    poseeAdjunto(registro) {
        return this.categoria.descargaAdjuntos && this.getAdjunto(registro);
    }

    private getAdjunto(registro) {
        return registro.registro.registros.find(x => x.nombre === 'documento adjunto');
    }

}
