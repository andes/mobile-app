import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';

import { HomePage } from '../home/home';
/**
 * Generated class for the NavbarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-navbar',
  templateUrl: 'navbar.html',
})
export class NavbarPage {

  @Input() esconderLogoutBtn: boolean;
  @Input() mostrarMenu: boolean;   

  ionViewDidLoad() {
    console.log('ionViewDidLoad NavbarPage');
  }

  logout() {
    this.authService.logout();
    this.navCtrl.setRoot(HomePage);
  }

  constructor(public authService: AuthProvider, public navCtrl: NavController,
    public navParams: NavParams) {

  }
}
