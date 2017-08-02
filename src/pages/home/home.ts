import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { LoginPage } from '../login/login';
import { RegistroPersonalDataPage } from '../registro/personal-data/personal-data';
import { AuthProvider } from '../../providers/auth/auth';

// pages
import { WaitingValidationPage } from '../registro/waiting-validation/waiting-validation';
import { NumerosUtilesPage } from '../datos-utiles/numeros-emergencia/numeros-utiles';
import { FarmaciasTurnoPage } from '../datos-utiles/farmacias-turno/farmacias-turno';
import { FeedNoticiasPage } from '../datos-utiles/feed-noticias/feed-noticias';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mostrarMenu: boolean = false;

  constructor(
    public authService: AuthProvider,
    private barcodeScanner: BarcodeScanner,
    public navCtrl: NavController) {

  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  numerosUtiles() {
    this.navCtrl.push(NumerosUtilesPage);
  }

  farmacias() {
    this.navCtrl.push(FarmaciasTurnoPage);
  }

  noticias() {
    this.navCtrl.push(FeedNoticiasPage);
  }

}
