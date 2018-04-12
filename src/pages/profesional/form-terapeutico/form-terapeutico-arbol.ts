import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../../providers/auth/auth';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FtpProvider } from '../../../providers/ftp';

@Component({
    selector: 'form-terapeutico-arbol',
    templateUrl: 'form-terapeutico-arbol.html',
})

export class formTerapeuticoArbolPage {
    private indice;
    
   
    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public authProvider: AuthProvider,

    ) 
    
    {
        console.log("Arbolllll");
       
    }
    ionViewDidLoad() {
    this.indice = this.navParams.get("indice");
    console.log(this.indice);
    console.log("ionviedidload");   
    }

 

}