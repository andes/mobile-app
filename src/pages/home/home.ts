import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { LoginPage } from '../login/login';
import { RegistroPersonalDataPage } from '../registro/personal-data/personal-data';
import { AuthProvider } from '../../providers/auth/auth';
import { VerificaCodigoPage } from '../verifica-codigo/verifica-codigo';
import { EscanerDniPage } from '../escaner-dni/escaner-dni';
import { WaitingValidationPage } from '../registro/waiting-validation/waiting-validation';
// import { WaitingValidationPage } from '../registro/waiting-validation/waiting-validation';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'  
})
export class HomePage {

  mostrarMenu: boolean = false;

  constructor(public authService: AuthProvider,
<<<<<<< HEAD
    private barcodeScanner: BarcodeScanner, public navCtrl: NavController) {   
  }  
=======
    private barcodeScanner: BarcodeScanner, public navCtrl: NavController) {

  }
>>>>>>> a6f61c57c418b9445a9d2e09a3900229713a37e5

  login() {
    this.navCtrl.push(LoginPage);
  }

  registro() {
    // this.navCtrl.push(RegistroPersonalDataPage);
    this.navCtrl.push(EscanerDniPage);
    // this.navCtrl.push(WaitingValidationPage, { user: { nombre: 'Mariano', apellido: 'Botta', documento: 34934522, fechaNacimiento: '2017-01-01', sexo: 'Masculino' } })

  }

  codigo() {
    this.navCtrl.push(VerificaCodigoPage);
  }
}
