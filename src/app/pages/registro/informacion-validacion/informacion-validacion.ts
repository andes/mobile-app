import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
// providers
import { AuthProvider } from '../../../../providers/auth/auth';


@Component({
    selector: 'app-informacion-validacion',
    templateUrl: 'informacion-validacion.html',
})
export class InformacionValidacionPage implements OnInit {

    loading: any;
    modelo: any = {};
    info: any;
    public textoLibre: string = null;

    ngOnInit() {
    }

    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public navCtrl: NavController,
        public navParams: NavParams) {
    }

    openMap(direccion) {
        window.open('geo:?q=' + direccion);
    }

}
