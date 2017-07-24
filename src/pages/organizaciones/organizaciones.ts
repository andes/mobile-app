import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// pages
import { AgendasPage } from '../profesional/agendas/agendas';

// providers
import { DeviceProvider } from '../../providers/auth/device';
import { ConstanteProvider } from '../../providers/constantes';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastProvider } from '../../providers/toast';

import config from '../../config';

@Component({
  selector: 'page-organizaciones',
  templateUrl: 'organizaciones.html'
})
export class OrganizacionesPage {
  tipoPrestacion: any[];
  organizaciones: any[] = null;
  usuario: String;
  password: String;

  constructor(
    public assetsService: ConstanteProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public deviceProvider: DeviceProvider,
    public platform: Platform,
    public toastCtrl: ToastProvider,
    public authProvider: AuthProvider) {

    this.usuario = this.navParams.get('usuario');
    this.password = this.navParams.get('password');
    this.organizaciones = this.assetsService.organizaciones;

  }

  ngOnDestroy() {

  }

  onOrganizacionClick(organizacion) {
    let credenciales = {
      usuario: this.usuario,
      password: this.password,
      organizacion: organizacion.id,
      mobile: true
    }

    this.authProvider.loginProfesional(credenciales).then(() => {
      this.deviceProvider.sync();
      this.navCtrl.setRoot(AgendasPage);
    }).catch(() => {
      this.navCtrl.pop();
      this.toastCtrl.danger("Credenciales incorrectas");
    })

  }

}
