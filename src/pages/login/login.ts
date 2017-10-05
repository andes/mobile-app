import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

// Providers...
import { DeviceProvider } from '../../providers/auth/device';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastProvider } from '../../providers/toast';
import { ConstanteProvider } from '../../providers/constantes';

// PAGES...
import { BienvenidaPage } from '../bienvenida/bienvenida';
import { OrganizacionesPage } from '../organizaciones/organizaciones';
import { VerificaCodigoPage } from '../registro/verifica-codigo/verifica-codigo';
import { InformacionValidacionPage } from '../registro/informacion-validacion/informacion-validacion';
import { RecuperarPasswordPage } from '../profile/recuperar-password/recuperar-password';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string;
  password: string;
  mostrarMenu: boolean = false;
  inProgress: boolean = false;
  emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  dniRegex = /^[0-9]{7,8}$/;

  constructor(
    public assetsService: ConstanteProvider,
    private toastCtrl: ToastProvider,
    public deviceProvider: DeviceProvider,
    public authService: AuthProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    //
  }


  onKeyPress($event, tag) {
    if ($event.keyCode == 13) {
      let element = document.getElementById(tag);
      if (element) {
        element.focus();
      }
    }
  }

  registro() {
    this.navCtrl.push(InformacionValidacionPage);

  }

  recuperarPassword() {
    this.navCtrl.push(RecuperarPasswordPage);
  }

  codigo() {
    this.navCtrl.push(VerificaCodigoPage);
  }

  login() {
    if (!this.dniRegex.test(this.email)) {
      let credentials = {
        email: this.email,
        password: this.password
      };
      this.inProgress = true;
      this.authService.login(credentials).then((result) => {
        this.inProgress = false;
        this.deviceProvider.sync();

        this.navCtrl.setRoot(BienvenidaPage);
      }, (err) => {
        this.inProgress = false;
        if (err) {
          this.toastCtrl.danger("Email o password incorrecto.");
        }
      });
    } else {
      let credenciales = {
        usuario: this.email,
        password: this.password,
        mobile: true
      }

      this.authService.loginProfesional(credenciales).then(() => {
        this.deviceProvider.sync();
        this.navCtrl.setRoot(OrganizacionesPage);
        // this.navCtrl.setRoot(AgendasPage);
      }).catch(() => {
        this.toastCtrl.danger("Credenciales incorrectas");
      })


      // this.assetsService.getOrganizaciones(this.email).then((data: any[]) => {
      //   if (data && data.length > 0) {
      //     this.navCtrl.push(OrganizacionesPage, { usuario: this.email, password: this.password });
      //   } else {
      //     this.toastCtrl.danger("Email o password incorrecto.");
      //   }
      // })

    }
  }

}
