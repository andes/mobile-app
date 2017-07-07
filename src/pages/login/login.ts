import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { DeviceProvider } from '../../providers/auth/device';
import { AuthProvider } from '../../providers/auth/auth';
import { BienvenidaPage } from '../bienvenida/bienvenida';
import { ToastProvider } from '../../providers/toast';
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
  inProgress: boolean = false;
  constructor(private toastCtrl: ToastProvider, public deviceProvider: DeviceProvider, public authService: AuthProvider, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    //
  }


  login() {

    //this.showLoader();

    let credentials = {
      email: this.email,
      password: this.password
    };
    this.inProgress = true;
    this.authService.login(credentials).then((result) => {
      //this.loading.dismiss();
      this.inProgress = false;
      this.deviceProvider.register().then(() => true, () => true);
      this.navCtrl.setRoot(BienvenidaPage);
    }, (err) => {
      //this.loading.dismiss();
      this.inProgress = false;
      this.toastCtrl.danger("Email o password incorrecto.");
    });

  }

  showLoader() {

    this.loading = this.loadingCtrl.create({
      content: 'Autenticando...'
    });

    this.loading.present();
  }

}
