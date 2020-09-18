import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';
import { PacienteProvider } from '../../../providers/paciente';
import { AuthProvider } from '../../../providers/auth/auth';
import { NavController } from 'ionic-angular';
import { ENV } from '@app/env';
import * as moment from 'moment/moment';

@Component({
    selector: 'detalle-categoria',
    templateUrl: 'detalle-categoria.html',
})

export class DetalleCategoriaPage {
    public categoria;
    public registros;

    constructor(
        public navParams: NavParams,
        public authProvider: AuthProvider,
        public pacienteProvider: PacienteProvider,
        public navCtrl: NavController,
        private alertCtrl: AlertController) {
        this.categoria = this.navParams.get('categoria');
    }

    ionViewDidLoad() {
        if (this.authProvider.user) {
            let pacienteId = this.authProvider.user.pacientes[0].id;
            this.pacienteProvider.huds(pacienteId, this.categoria.expresionSnomed).then((registros: any[]) => {
                this.registros = registros;
            });
        }
    }

    fecha(registro) {
        return moment(registro.fecha).format('DD [de] MMMM [del] YYYY');
    }

    verRegistro(registro) {
        if (this.categoria.descargaAdjuntos) {
            let elementoAdjuntos = registro.registro.registros.find(x => x.nombre === 'documento adjunto');
            if (elementoAdjuntos) {
                let url = ENV.API_URL + 'modules/rup/store/' + elementoAdjuntos.valor.documentos[0].id + '?token=' + this.authProvider.token;
                window.open(url);
            } else {
                let alert = this.alertCtrl.create({
                    title: 'Error',
                    subTitle: 'No se pudo encontrar el archivo asociado',
                    buttons: ['Cerrar']
                });
                alert.present();
            }
        }
    }
}
