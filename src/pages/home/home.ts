import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { LoginPage } from '../login/login';
import { RegistroPersonalDataPage } from '../registro/personal-data/personal-data';
import { AuthProvider } from '../../providers/auth/auth';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

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

  login() {
    this.navCtrl.push(LoginPage);
  }

  registro() {
    this.navCtrl.push(RegistroPersonalDataPage);
  }
}
