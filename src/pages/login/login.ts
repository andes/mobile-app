import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { TurnosPage } from '../turnos/turnos';
import { BienvenidaPage } from '../bienvenida/bienvenida';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string;
  password: string;
  loading: any;
  mostrarMenu: boolean = false;
  esconderLogoutBtn: boolean = true;

  constructor(public authService: AuthProvider, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    /*
    this.showLoader();
    // Check if already authenticated
    this.authService.checkAuthentication().then((res) => {
      console.log("Ya está autorizado");
      this.loading.dismiss();
      this.navCtrl.setRoot(TurnosPage);
    }, (err) => {
      console.log("No está autorizado");
      this.loading.dismiss();
    });
    */

  }

  login() {

    this.showLoader();

    let credentials = {
      email: this.email,
      password: this.password
    };

    this.authService.login(credentials).then((result) => {
      this.loading.dismiss();
      console.log(result);
      this.navCtrl.setRoot(BienvenidaPage);
    }, (err) => {
      this.loading.dismiss();
      console.log(err);
    });

  }

  showLoader() {

    this.loading = this.loadingCtrl.create({
      content: 'Autenticando...'
    });

    this.loading.present();
  }

}
