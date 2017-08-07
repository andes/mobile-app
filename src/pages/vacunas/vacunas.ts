import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { VacunasProvider } from '../../providers/vacunas/vacunas';
/**
 * Generated class for the VacunasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-vacunas',
  templateUrl: 'vacunas.html',
})
export class VacunasPage {
  vacunas: any[] = null;

  constructor(public vacunasProvider: VacunasProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getVacunas();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VacunasPage');
  }

  getVacunas() {
    var params = { dni: '' };
    this.vacunasProvider.get(params).then((data: any[]) => {
      console.log(data);
      this.vacunas = data;
    });
  }
}
