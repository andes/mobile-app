// import { AlertController } from '@ionic/angular';
import { AlertController, NavController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { EmailComposer } from '@ionic-native/email-composer';

// CORE
import { Component, OnInit, Input, ɵConsole } from '@angular/core';
// providders
import { ToastProvider } from '../../providers/toast';
import { IPageGestion } from 'interfaces/pagesGestion';
import { AuthProvider } from '../../providers/auth/auth';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { ifError } from 'assert';
import { NetworkProvider } from '../../providers/network';

@Component({
    selector: 'VisualizarProblema',
    templateUrl: 'visualizarProblema.html',
    styles: ['visualizarProblema.scss']

})

export class VisualizarProblema implements OnInit {
    @Input() origen;
    @Input() titulo: String;
    @Input() dataPage: any;
    @Input() problema: any;
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
    public estadosArray = ['pendiente', 'resuelto', 'en proceso']
    public imagenes;
    public edit = false;
    public nuevoEstado;
    public estadoTemporal;
    constructor(public navCtrl: NavController,
        private _FORM: FormBuilder,
        private _CAMERA: Camera,
        public toast: ToastProvider,
        public emailCtr: EmailComposer,
        public authService: AuthProvider,
        public datosGestion: DatosGestionProvider,
        public alertController: AlertController,
        public network: NetworkProvider
    ) {
        // this.form = this._FORM.group({
        //     'quienRegistra': ['', Validators.required],
        //     'responsable': ['', Validators.required],
        //     'plazo': ['', Validators.required],
        //     'problema': ['', Validators.required],
        //     'adjuntos': [''],
        //     'estado': ['Pendiente'],
        //     'fechaRegistro': [new Date()]

        // });
    }

    ngOnInit() {
        this.loader = false;
        this.estadoTemporal = this.problema.estado;
        this.traeDatos(this.problema)        // await this.datosGestion.obtenerImagenes()

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

    delete(item) {
        if (this._attachment.length > 0) {
            this._attachment.splice(item, 1);
        }
    }

    async traeDatos(problema) {
        this.imagenes = await this.datosGestion.obtenerImagenesProblemasPorId(problema.idProblema);
    }
    
    editar() {
        this.edit = true;
        this.nuevoEstado = this.problema.estado;

    }

    async confirmAlert() {
        const alert = await this.alertController.create({
            title: 'Confirmar',
            message: '¿Desea cambiar el estado?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        this.problema.estado = this.estadoTemporal;
                    }
                }, {
                    text: 'Aceptar',
                    handler: () => {
                        this.actualizarProblema();
                    }
                }
            ]
        });

        await alert.present();
    }


    async actualizarProblema() {
        this.problema.estado = this.nuevoEstado.toLowerCase();
        this.edit = false;
        let resultado = this.datosGestion.updateEstadoProblema(this.problema)
        let estadoDispositivo = this.network.getCurrentNetworkStatus();

        if (resultado && estadoDispositivo === 'online') {
            let data: any = await this.datosGestion.patchMongoProblemas(this.problema)
            // Seteamos como actualizado el registro
            this.datosGestion.updateEstadoActualizacion(resultado, data._id);
        }
    }
}
