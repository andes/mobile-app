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
    hayMas = false;
    buscando = false;
    count = 0;
    pageSize = 10;

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
        this.pacienteProvider.laboratorios(pacienteId, {}).then((cdas:any[]) => {
            this.cdas = cdas.map(item => {
                item.fecha = moment(item.fecha);
                return item;
            });
            this.hayMas = cdas.length === 1;
        });
    }
  }

  buscar() {
    this.count++;
    this.buscando = true;
    let pacienteId = this.authProvider.user.pacientes[0].id;
    this.pacienteProvider.laboratorios(pacienteId, { limit: 10, skip: this.count * 10 }).then((cdas:any[]) => {
        this.buscando = false;
        cdas.forEach(item => {
            item.fecha = moment(item.fecha);
            this.cdas.push(item);
        });
        this.hayMas = cdas.length === 1;
    });
  }

  link(cda) {
      if (cda.confidentialityCode !== 'R') {
          let url =  ENV.API_URL + 'modules/cda/' + cda.adjuntos[0] + '?token=' + this.authProvider.token;
          window.open(url);
      }
  }
}
