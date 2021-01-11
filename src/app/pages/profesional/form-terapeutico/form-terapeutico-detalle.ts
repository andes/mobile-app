import { LoadingController, NavController, NavParams } from '@ionic/angular';
import { AuthProvider } from 'src/providers/auth/auth';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FtpProvider } from 'src/providers/ftp';
import { Router } from '@angular/router';


@Component({
    selector: 'app-terapeutico-detalle',
    templateUrl: 'form-terapeutico-detalle.html',
})

export class FormTerapeuticoDetallePage implements OnInit {
    mostrarMenu = false;
    item;
    padres;

    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public ftp: FtpProvider,
        public authProvider: AuthProvider,
        public router: Router,

    ) {
    }

    ngOnInit() {
        this.storage.get('ftp-detalle').then((medicamento) => {
            this.item = medicamento.item;
            this.padres = medicamento.padres;
        });

    }

    volver() {
        this.router.navigate(['/profesional/formulario-terapeutico/arbol']);
    }

}
