import { formTerapeuticoDetallePage } from './form-terapeutico-detalle';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../../providers/auth/auth';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FtpProvider } from '../../../providers/ftp';

@Component({
    selector: 'form-terapeutico',
    templateUrl: 'form-terapeutico.html',
})

export class formTerapeuticoPage {
    mostrarMenu: boolean = false;
    formRegistro: FormGroup;
    private capitulos: any[];
    private filtrados: any[];

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

        this.formRegistro = formBuilder.group({
            nombre: ['', Validators.required],
        }, {
                // validator: PasswordValidation.MatchPassword
            });

    }

    onKeyPress($event, tag) {

    }

    buscarMedicamentos(params) {
        this.filtrados = [];
        this.ftp.get(params).then((data: any) => {

            this.capitulos = data;
            this.capitulos.forEach((capitulo, indiceCapitulo) => {
                capitulo.subcapitulos.forEach((subcapitulo, indiceSubcapitulo) => {
                    subcapitulo.medicamentos.forEach((medicamento, indiceMedicamento) => {
                        let nuevoMedicamento = {
                            indiceCapitulo: indiceCapitulo,
                            subcapitulo: indiceSubcapitulo,
                            indiceMedicamento: indiceMedicamento,
                            medicamento: medicamento
                        };
                        this.filtrados.push(nuevoMedicamento);
                    });
                });
            });
        });
    }

    onCancel(){
        this.filtrados = [];
    }

    itemSelected(filtrado) {
        
        let params = {
            capitulo:  this.capitulos[filtrado.indiceCapitulo],
            subcapitulo: this.capitulos[filtrado.indiceCapitulo].subcapitulos[filtrado.subcapitulo],
            medicamento: filtrado.medicamento
        }
        this.navCtrl.push(formTerapeuticoDetallePage, params);
    }

    onSubmit({ value, valid }: { value: any, valid: boolean }) {
        let params = {
            nombreMedicamento: value.nombre
        }
        this.buscarMedicamentos(params);
    }
}
