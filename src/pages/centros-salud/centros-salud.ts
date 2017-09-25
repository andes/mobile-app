import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MapPage } from './map/map';
import { ListPage } from './list/list';
/**
 * Generated class for the CentrosSaludPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-centros-salud',
  templateUrl: 'centros-salud.html',
})
export class CentrosSaludPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CentrosSaludPage');
  }

  tab1Root: any = MapPage;
  tab2Root: any = ListPage;
}
