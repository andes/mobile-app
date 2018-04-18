import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../../providers/auth/auth';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FtpProvider } from '../../../providers/ftp';
import { formTerapeuticoDetallePage } from './form-terapeutico-detalle';

@Component({
    selector: 'arbolItem',
    templateUrl: 'arbolItem.html',
})

export class arbolItem implements OnInit {
    private indices;
    private titulo;
    private padres: any[];
    private hijos: any[];


    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public ftp: FtpProvider,
    ) {

    }

    esHoja () {
        return !this.indice.arbol || this.indice.arbol.length === 0;
    }

    @Input()indice: any;    
    
    ngOnInit() {
        
    }

    buscarHijos() {
        this.ftp.get({ tree: 1, idpadre: this.indice._id }).then((data: any) => {
             this.hijos = data;

        });
    }

}