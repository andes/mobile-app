import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

// CORE
import { Component, OnInit, Input } from '@angular/core';
// providders
import { ToastProvider } from '../../../../providers/toast';
import { IPageGestion } from '../../../../interfaces/pagesGestion';
import { AuthProvider } from '../../../../providers/auth/auth';
import { Principal } from './../../principal';
import * as moment from 'moment/moment';
import { DatosGestionProvider } from '../../../../providers/datos-gestion/datos-gestion.provider';
import { NetworkProvider } from '../../../../providers/network';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

@Component({
    selector: 'editar-minuta',
    templateUrl: 'editarMinuta.html',
    styles: ['../../registroProblema.scss']

})

export class EditarMinuta implements OnInit {
    public origen;
    @Input() titulo: String;
    @Input() dataPage: any;
    public minuta;
    public backPage: IPageGestion;
    public form: FormGroup;
    public loader: boolean;
    public idMinutaSQL = null;
    public idMinutaMongo = null;
    public descripcion;
    public fechaActual = new Date();
    public anio = moment(this.fechaActual).year() + 2;
    // public fechaActual = new Date().toISOString();
    constructor(public navCtrl: NavController,
        private _FORM: FormBuilder,
        public toast: ToastProvider,
        public authService: AuthProvider,
        public datosGestion: DatosGestionProvider,
        public network: NetworkProvider,
        public navParams: NavParams,
        private speechRecognition: SpeechRecognition

    ) {
        this.minuta = this.navParams.get('minuta') ? this.navParams.get('minuta') : '';
        this.origen = this.navParams.get('origen') ? this.navParams.get('origen') : '';
        if (!this.minuta) {
            this.navCtrl.push(Principal, { page: 'listadoMinutas', data: this.dataPage, origen: this.origen });
            this.toast.success('ERROR AL INTENTAR EDITAR');
        }
        this.idMinutaSQL = this.minuta.idMinuta;
        this.idMinutaMongo = this.minuta.idMongo;
        this.form = this._FORM.group({
            'quienRegistra': [this.minuta.quienRegistra, Validators.required],
            'fecha': [this.minuta.fecha, Validators.required],
            'participantes': [this.minuta.participantes],
            'temas': [this.minuta.temas],
            'conclusiones': [this.minuta.conclusiones],
            'fechaProxima': [this.minuta.fechaProxima],
            'lugarProxima': [this.minuta.lugarProxima],
        });
    }

    ngOnInit() {
        this.loader = false;
        this.descripcion = this.minuta.origen;
        this.speechRecognition.hasPermission()
            .then((hasPermission: boolean) => {
                if (!hasPermission) {
                    this.speechRecognition.requestPermission();
                }
            });
    }

    record(fieldName: string): void {
        const options = {
            language: 'es-ES',
            showPartial: false
        };

        this.speechRecognition.startListening(options).subscribe(
            (matches: Array<string>) => {
                this.form.controls[fieldName].setValue(matches[0]);
            },
            onerror => {
                if (onerror.indexOf('Code=203') !== -1) {
                    this.toast.danger('No se pudo procesar el audio, reintentar!');
                }
            }
        );
    }

    hasPermission(): void {
        this.speechRecognition
            .hasPermission()
            .then((hasPermission: boolean) => {
                if (!hasPermission) {
                    this.speechRecognition
                        .requestPermission()
                        .then(
                            (error) => this.toast.danger(error)
                        );
                }
            });
    }

    async guardar() {
        this.loader = true;
        try {
            await this.controlGuardar();
            this.loader = false;
            this.navCtrl.push(Principal, { page: 'listadoMinutas', data: this.dataPage, origen: this.origen });
            this.toast.success('SE REGISTRO CORRECTAMENTE');
        } catch (error) {
            this.loader = false;
            this.toast.danger('ERROR REGISTRANDO!');
        }

    }


    async controlGuardar() {
        let estadoDispositivo = this.network.getCurrentNetworkStatus();
        if (this.idMinutaSQL) {
            this.datosGestion.updateMinuta(this.idMinutaSQL, this.form.value, this.descripcion);
            let unaMinuta = await this.datosGestion.obtenerMinuta(this.idMinutaSQL)
            if (estadoDispositivo === 'online') {
                await this.datosGestion.patchMongoMinuta(unaMinuta, this.idMinutaMongo);
                // Seteamos como actualizado el registro
                this.datosGestion.updateActualizacionMinuta(unaMinuta, this.idMinutaMongo);
            }
        } else {
            this.toast.success('PARAMETROS INCORRECTOS');
        }

    }

    verProblema(problema) {
        this.navCtrl.push(Principal, { page: 'VisualizarProblema', registroProblema: problema, origen: this.origen });
    }

}
