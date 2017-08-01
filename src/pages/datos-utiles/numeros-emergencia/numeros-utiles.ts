import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { RegistroPersonalDataPage } from '../registro/personal-data/personal-data';
import { AuthProvider } from '../../../providers/auth/auth';

import { WaitingValidationPage } from '../registro/waiting-validation/waiting-validation';

@Component({
  selector: 'page-numeros-utiles',
  templateUrl: 'numeros-utiles.html'
})
export class NumerosUtilesPage {
  mostrarMenu: boolean = false;

  constructor(
    public authService: AuthProvider,
    public navCtrl: NavController) {

  }


  call(phone) {
    window.open('tel:' + phone);
  }
}
