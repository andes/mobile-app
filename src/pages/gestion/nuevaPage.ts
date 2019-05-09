import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { PasswordValidation } from '../../../validadores/validar-password';
import { Storage } from '@ionic/storage'

// providders

// pages


@Component({
    selector: 'nueva-page',
    templateUrl: 'nueva-page.html',
})
export class NuevaPage {
    loading: any;
    submit = false;
    errors: any = {};
    telefono: string;

    email: string;
    password: string;
    dataMpi: any = {};
    running = false;

    constructor(
        public storage: Storage,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public formBuilder: FormBuilder) {

    }

}
