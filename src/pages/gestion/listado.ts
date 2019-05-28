


import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../../providers/auth/auth';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FtpProvider } from '../../../providers/ftp';
import { FormTerapeuticoDetallePage } from './form-terapeutico-detalle';
import { IPageGestion } from 'interfaces/pagesGestion';
import { Principal } from './principal';

@Component({
    selector: 'listado',
    templateUrl: 'listado.html',
})

export class ListadoComponent {
    public indices;
    public titulo;
    public padres: any[];
    public backPage: IPageGestion;
    @Input() activePage: IPageGestion;
    constructor(
        public storage: Storage,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
    ) {

    }
    ionViewDidLoad() {
        this.indices = this.navParams.get('indices');
        this.titulo = this.navParams.get('titulo');
    }
    cambiarPagina(datos: any) {
        debugger;
        this.backPage = Object.assign({}, this.activePage);
        this.navCtrl.push(Principal, { page: datos.goto });
    }

}
