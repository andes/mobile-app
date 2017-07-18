import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { LoginPage } from '../login/login';
import { RegistroPersonalDataPage } from '../registro/personal-data/personal-data';
import { AuthProvider } from '../../providers/auth/auth';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { VerificaCodigoPage } from '../verifica-codigo/verifica-codigo';
import { EscanerDniPage } from '../escaner-dni/escaner-dni';
import { WaitingValidationPage } from '../registro/waiting-validation/waiting-validation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mostrarMenu: boolean = false;
  esconderLogoutBtn: boolean = true;

  constructor(public usuariosService: UsuariosProvider, public authService: AuthProvider,
    private barcodeScanner: BarcodeScanner, public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    if ((window as any).SmsReceiver) {
      (window as any).SmsReceiver.isSupported((supported) => {
        if (supported) {
          alert("SMS supported!")
        } else {
          alert("SMS not supported")
        }
      })
    }

    (window as any).SmsReceiver.startReception(({ messageBody, originatingAddress }) => {
      alert("Mensaje leído" + messageBody);
    }, () => {
      alert("Error while receiving messages")
    })
  }
  
  login() {
    this.navCtrl.push(LoginPage);
  }

  registro() {
    // this.navCtrl.push(RegistroPersonalDataPage);
    this.navCtrl.push(EscanerDniPage);

  }

  codigo() {
    this.navCtrl.push(VerificaCodigoPage);
  }
}
