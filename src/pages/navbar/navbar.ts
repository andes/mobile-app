import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { DeviceProvider } from '../../providers/auth/device';

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

  // @Input() esconderLogoutBtn: boolean;
  @Input() mostrarMenu: boolean;

  ionViewDidLoad() {
    //
  }

  constructor(
    public authService: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public deviceProvider: DeviceProvider) {

  }
}
