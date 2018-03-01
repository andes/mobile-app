import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

// providers
import { AuthProvider } from '../../providers/auth/auth';

// pages
import { HomePage } from "../home/home";


/**
 * DEPRECATED
 */

@Component({
  selector: 'page-bienvenida',
  templateUrl: 'bienvenida.html',
})
export class BienvenidaPage implements OnInit {
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
