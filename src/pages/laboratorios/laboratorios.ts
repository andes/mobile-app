import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'

import { ToastProvider } from '../../providers/toast';
import { PacienteProvider } from '../../providers/paciente';
import * as moment from 'moment';
import { ENV } from '@app/env';


/**
 * Generated class for the VacunasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-laboratorios',
  templateUrl: 'laboratorios.html',
})
export class LaboratoriosPage {
    cdas: any[] = null;

  constructor(
    public storage: Storage,
    public pacienteProvider: PacienteProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    private toastCtrl: ToastProvider, ) {

  }

  ionViewDidLoad() {
    if (this.authProvider.user) {
        let pacienteId = this.authProvider.user.pacientes[0].id;
        this.pacienteProvider.laboratorios(pacienteId).then((cdas:any[]) => {
            this.cdas = cdas.map(item => {
                item.fecha = moment(item.fecha);
                return item;
            });

        });
    }
  }

  link(cda) {
    let url =  ENV.API_URL + 'modules/cda/' + cda.adjuntos[0] + '?token=' + this.authProvider.token;
    window.open(url);
  }


}
