import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../../providers/auth/auth';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FtpProvider } from '../../../providers/ftp';

@Component({
    selector: 'form-terapeutico-detalle',
    templateUrl: 'form-terapeutico-detalle.html',
})

export class formTerapeuticoDetallePage {
    mostrarMenu: boolean = false;
    private capitulo;
    private subcapitulo;
    private medicamento;

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
        this.capitulo = this.navParams.get("capitulo"); 
        this.subcapitulo = this.navParams.get("subcapitulo"); 
        this.medicamento = this.navParams.get("medicamento"); 
        // console.log(this.navParams);
    }

    onKeyPress($event, tag) { }

}
