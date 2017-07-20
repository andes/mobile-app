import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { DeviceProvider } from '../../providers/auth/device';
import { ConstanteProvider } from '../../providers/constantes';
import { AuthProvider } from '../../providers/auth/auth';
import { Subscription } from 'rxjs';

import * as moment from 'moment/moment';

@Component({
  selector: 'page-organizaciones',
  templateUrl: 'organizaciones.html'
})
export class OrganizacionesPage {
  tipoPrestacion: any[];
  organizaciones: any[] = null;
  usuario: String;
  password: String;
  ngOnDestroy() {

  }

  constructor(
    public assetsService: ConstanteProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public devices: DeviceProvider,
    public platform: Platform,
    public authProvider: AuthProvider) {
    this.usuario = this.navParams.get('usuario');
    this.password = this.navParams.get('password');

    this.assetsService.getOrganizaciones(this.usuario).then((data: any[]) => {
      this.organizaciones = data;
    }).catch(() => false);
  }

  onOrganizacionClick(organizacion) {
    let credenciales = {
      usuario: this.usuario,
      password: this.password,
      organizacion: organizacion.id,
      mobile: true
    }


    this.authProvider.loginProfesional(credenciales)
  }

}
