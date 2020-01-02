import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { EmailComposer } from '@ionic-native/email-composer';

// CORE
import { Component, OnInit, Input, ɵConsole } from '@angular/core';
// providders
import { ToastProvider } from '../../providers/toast';
import { IPageGestion } from 'interfaces/pagesGestion';
import { AuthProvider } from '../../providers/auth/auth';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import * as moment from 'moment/moment';
import { NetworkProvider } from '../../providers/network';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

@Component({
    selector: 'registroProblema',
    templateUrl: 'registroProblema.html',
    styles: ['registroProblema.scss']

})

export class RegistroProblema implements OnInit {
    @Input() origen;
    @Input() idMinutaSQL;

    @Input() idMinutaMongo;
    @Input() titulo: String;
    @Input() dataPage: any;
    @Input() callback: any;
    public backPage: IPageGestion;
    public form: FormGroup;
    public _attachment: any = [];
    public imagen: string = null;
    public correos: any = [];
    public to: any = [];
    public asunto: string;
    public mensaje: string;
    public loader: boolean;
    public estado = 'Pendiente';
    public estadosArray = ['Pendiente'];
    public fechaActual = new Date();
    public anio = moment(this.fechaActual).year() + 2;


    constructor(public navCtrl: NavController,

        public navParams: NavParams,
        private _FORM: FormBuilder,
        private _CAMERA: Camera,
        public toast: ToastProvider,
        public emailCtr: EmailComposer,
        public authService: AuthProvider,
        public datosGestion: DatosGestionProvider,
        public network: NetworkProvider,
        private speechRecognition: SpeechRecognition

    ) {
        this.form = this._FORM.group({
            'responsable': ['', Validators.required],
            'plazo': ['', Validators.required],
            'problema': ['', Validators.required],
            'estado': ['Pendiente'],
            'fechaRegistro': [new Date().toISOString()]

        });
    }

    ngOnInit() {
        this.dataPage = this.navParams.get('data') ? this.navParams.get('data') : '';
        this.origen = this.navParams.get('origen') ? this.navParams.get('origen') : '';
        this.idMinutaSQL = this.navParams.get('idMinutaSQL') ? this.navParams.get('idMinutaSQL') : '';
        this.idMinutaMongo = this.navParams.get('idMinutaMongo') ? this.navParams.get('idMinutaMongo') : '';
        this.loader = false;
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

    seleccionarArchivo() {
        let options: CameraOptions = {
            sourceType: this._CAMERA.PictureSourceType.PHOTOLIBRARY,
            destinationType: this._CAMERA.DestinationType.DATA_URL,
            encodingType: this._CAMERA.EncodingType.JPEG,
            correctOrientation: true

        };

        this._CAMERA.getPicture(options)
            .then((imageData: any) => {
                this.imagen = `data:image/jpeg;base64,${imageData}`;
                this._attachment.push(this.imagen);
            }).catch(error => {
                this.toast.danger('No se adjunto archivo');
            });

    }

    async guardar() {
        this.loader = true;
        let descripcion = this.dataPage ? (this.dataPage.descripcion) : this.origen.titulo;
        try {
            let resultado = await this.datosGestion.insertProblemas(this.form.value, this._attachment, descripcion, 1, null, this.idMinutaSQL, this.idMinutaMongo)
            if (resultado) {
                let estadoDispositivo = this.network.getCurrentNetworkStatus();
                if (estadoDispositivo === 'online') {
                    // guardamos en mongo
                    let problemaRegistrado: any = await this.datosGestion.postMongoProblemas(resultado)
                    // Seteamos como actualizado el registro
                    this.datosGestion.updateEstadoActualizacion(resultado, problemaRegistrado._id);
                }
                this.loader = false;
                this.toast.success('SE REGISTRO CORRECTAMENTE');
                this.navCtrl.pop().then(() => {
                    this.navParams.get('callback')(resultado);
                });
            }
        } catch (error) {
            this.loader = false;
            this.toast.danger('ERROR REGISTRANDO!');
        }

    }
    delete(item) {
        if (this._attachment.length > 0) {
            this._attachment.splice(item, 1);
        }
    }

}
