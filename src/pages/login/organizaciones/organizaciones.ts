import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

// pages

// providers
import { DeviceProvider } from '../../../providers/auth/device';
import { ConstanteProvider } from '../../../providers/constantes';
import { AuthProvider } from '../../../providers/auth/auth';
import { ToastProvider } from '../../../providers/toast';
import { HomePage } from "../../home/home";

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
    this.organizaciones = [];

  }

  ionViewDidLoad() {
    this.assetsService.getOrganizaciones(null).then((data:any[]) => {
      this.organizaciones = data;
      if (data.length === 1) {
          this.onOrganizacionClick(this.organizaciones[0]);
      }
    });
  }

  ngOnDestroy() {

  }

  onOrganizacionClick(organizacion) {
    this.authProvider.selectOrganizacion({organizacion: organizacion.id}).then(() => {
      this.navCtrl.setRoot(HomePage);
    }).catch(() => {
      this.toastCtrl.danger("Credenciales incorrectas");
    });
    // let credenciales = {
    //   usuario: this.usuario,
    //   password: this.password,
    //   organizacion: organizacion.id,
    //   mobile: true
    // }

    // this.authProvider.loginProfesional(credenciales).then(() => {
    //   this.deviceProvider.sync();
    //   this.navCtrl.setRoot(HomePage);
    //   // this.navCtrl.setRoot(AgendasPage);
    // }).catch(() => {
    //   this.navCtrl.pop();
    //   this.toastCtrl.danger("Credenciales incorrectas");
    // })

  }

}
