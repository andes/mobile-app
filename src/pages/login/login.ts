import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

// Providers...
import { DeviceProvider } from '../../providers/auth/device';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastProvider } from '../../providers/toast';

// PAGES...
import { BienvenidaPage } from '../bienvenida/bienvenida';
import { OrganizacionesPage } from '../organizaciones/organizaciones';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string;
  password: string;
  mostrarMenu: boolean = false;
  esconderLogoutBtn: boolean = true;
  inProgress: boolean = false;
  emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  constructor(private toastCtrl: ToastProvider, public deviceProvider: DeviceProvider, public authService: AuthProvider, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    //
  }


  login() {
    if (this.emailRegex.test(this.email)) {
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
    } else {
      this.navCtrl.push(OrganizacionesPage, { usuario: this.email, password: this.password });
    }
  }

}
