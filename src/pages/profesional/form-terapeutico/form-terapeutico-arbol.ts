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
   
    constructor(
       
    ) {
        console.log("Arbolllll");
        
    }

 

}