import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'

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

  constructor(
    public storage: Storage,
    public vacunasProvider: VacunasProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider) {

    this.getVacunas();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VacunasPage');
  }

  getVacunas() {
    let params = { dni: this.authProvider.user.documento };
    this.vacunasProvider.get(params).then((data: any[]) => {
      this.vacunas = data;
    });

  }
}
