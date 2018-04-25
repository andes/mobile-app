import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../../providers/auth/auth';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FtpProvider } from '../../../providers/ftp';
import { FormTerapeuticoPage } from './form-terapeutico';


@Component({
    selector: 'form-terapeutico-detalle',
    templateUrl: 'form-terapeutico-detalle.html',
})

export class FormTerapeuticoDetallePage {
    mostrarMenu = false;
    private item;
    private padres;

    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public ftp: FtpProvider,
        public authProvider: AuthProvider,

    ) {
        this.item = this.navParams.get('item');
        this.padres = this.navParams.get('padres');
    }

    onKeyPress($event, tag) { }

    volver() {
        this.navCtrl.pop();
    }

}
