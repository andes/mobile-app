import { Component } from '@angular/core';
import { NavParams, AlertController, NavController } from '@ionic/angular';
import { PacienteProvider } from 'src/providers/paciente';
import { AuthProvider } from 'src/providers/auth/auth';
import { ENV } from '@app/env';
import * as moment from 'moment/moment';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-detalle-categoria',
    templateUrl: 'detalle-categoria.html',
})

export class DetalleCategoriaPage {
    familiar: any = false;
    familiar$: Observable<any>;
    public categoria;
    public registros;

    constructor(
        public navParams: NavParams,
        public authProvider: AuthProvider,
        public pacienteProvider: PacienteProvider,
        public route: ActivatedRoute,
        public navCtrl: NavController,
        private alertCtrl: AlertController,
        public storage: Storage) {
        this.route.queryParams.subscribe(params => {
            this.categoria = JSON.parse(params.categoria);
            this.storage.get('familiar').then((value) => {
                if (value) {
                    this.familiar = value;
                    this.familiar$ = of(value);
                }
            });
        });
    }

    ionViewWillEnter() {
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
    }

    fecha(registro) {
        return moment(registro.fecha).format('DD [de] MMMM [del] YYYY');
    }

    async verRegistro(registro) {
        if (this.categoria.descargaAdjuntos) {
            const elementoAdjuntos = registro.registro.registros.find(x => x.nombre === 'documento adjunto');
            if (elementoAdjuntos) {
                const url = ENV.API_URL + 'modules/rup/store/' +
                    elementoAdjuntos.valor.documentos[0].id + '?token=' + this.authProvider.token;
                window.open(url);
            } else {
                const alert = await this.alertCtrl.create({
                    header: 'Error',
                    subHeader: 'No se pudo encontrar el archivo asociado',
                    buttons: ['Cerrar']
                });
                await alert.present();
            }
        }
    }
}
