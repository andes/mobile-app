import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-campania-detalle',
    templateUrl: 'campania-detalle.html'
})
export class CampaniaDetallePage {
    campania;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams, ) {
        this.campania = this.navParams.get('campania');
    }

}
