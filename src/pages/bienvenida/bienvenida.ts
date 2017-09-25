import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import * as moment from 'moment/moment';

// providers
import { AuthProvider } from '../../providers/auth/auth';

// pages
import { RegistroUserDataPage } from '../registro/user-data/user-data';
import { TurnosPage } from '../turnos/turnos';
import { HomePage } from "../home/home";

@Component({
  selector: 'page-bienvenida',
  templateUrl: 'bienvenida.html',
})
export class BienvenidaPage implements OnInit {

  mostrarMenu: boolean = true;
  user: any;

  ngOnInit() {

  }

  constructor(
    public authService: AuthProvider,
    public navCtrl: NavController) {

    this.user = this.authService.user;
  }

  ionViewDidLoad() {
    //
  }

  continuar() {
    this.navCtrl.setRoot(HomePage);
  }


}
