import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../../providers/auth/auth';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'form-terapeutico',
    templateUrl: 'form-terapeutico.html',
})

export class formTerapeuticoPage {
    mostrarMenu: boolean = false;
    formRegistro: FormGroup;
    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
    ) {

        this.formRegistro = formBuilder.group({
            nombre: ['', Validators.required],
        }, {
                // validator: PasswordValidation.MatchPassword
            });

    }

    onKeyPress($event, tag) {
       
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        alert(value.nombre);
    }
}
