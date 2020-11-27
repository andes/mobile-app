import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { AuthProvider } from '../../../../providers/auth/auth';

@Component({
    selector: 'app-numeros-utiles',
    templateUrl: 'numeros-utiles.html'
})
export class NumerosUtilesPage {

    constructor(
        public authService: AuthProvider,
        public navCtrl: NavController) {

    }


    call(phone) {
        window.open('tel:' + phone);
    }
}
