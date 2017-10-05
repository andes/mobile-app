import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { DeviceProvider } from '../../providers/auth/device';

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
