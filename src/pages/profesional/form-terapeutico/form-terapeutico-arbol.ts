import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../../providers/auth/auth';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FtpProvider } from '../../../providers/ftp';
import { formTerapeuticoDetallePage } from './form-terapeutico-detalle';

@Component({
    selector: 'form-terapeutico-arbol',
    templateUrl: 'form-terapeutico-arbol.html',
})

export class formTerapeuticoArbolPage {
    private indices;
    private titulo;
    private padres: any[];


    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public authProvider: AuthProvider,
        public ftp: FtpProvider,


    ) {

    }
    ionViewDidLoad() {
        this.indices = this.navParams.get("indices");
        this.titulo = this.navParams.get("titulo");
    }
    openSubarbol(indice) {
        this.ftp.get({ tree: 1, idpadre: indice._id }).then((data: any) => {
            let params = {
                indices: data,
                titulo: indice.descripcion
            }
            if (indice.arbol.length == 0) {

                this.ftp.get({ idpadre: indice.idpadre }).then((data: any) => {
                    this.padres = data;
                    let params = {
                        item: indice,
                        idpadres: this.padres
                    };
                    this.navCtrl.push(formTerapeuticoDetallePage, params);
                });

            }
            else {
                this.navCtrl.push(formTerapeuticoArbolPage, params);
            }
        });
    }



}