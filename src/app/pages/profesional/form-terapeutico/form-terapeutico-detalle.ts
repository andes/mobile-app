import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { AuthProvider } from 'src/providers/auth/auth';
import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FtpProvider } from 'src/providers/ftp';


@Component({
    selector: 'app-terapeutico-detalle',
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
