import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { LoginPage } from '../login/login';
import { RegistroPage } from '../registro/registro';
import { NavbarPage } from '../navbar/navbar';
import { AuthProvider } from '../../providers/auth/auth';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  usuarios: any;

  constructor(public usuariosService: UsuariosProvider, public authService: AuthProvider, private barcodeScanner: BarcodeScanner, public navCtrl: NavController) { }

  login() {
    this.navCtrl.push(LoginPage);
  }

  registro() {
    this.navCtrl.push(RegistroPage);
  }
}
