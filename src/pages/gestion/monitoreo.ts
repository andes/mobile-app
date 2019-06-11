import { AlertController, NavController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { EmailComposer } from '@ionic-native/email-composer';

// CORE
import { Component, OnInit, Input } from '@angular/core';
// providders
import { ToastProvider } from '../../providers/toast';
import { IPageGestion } from 'interfaces/pagesGestion';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
    selector: 'monitoreo',
    templateUrl: 'monitoreo.html',
    styles: ['monitoreo.scss']
})

export class MonitoreoComponent implements OnInit {
    formularioUsuario: FormGroup;
    public _attachment: any = [];
    public imagen: string = null;
    public correos: any = [];
    public to: any = [];
    public asunto: string;
    public mensaje: string;
    constructor(public navCtrl: NavController,
        private alertCtrl: AlertController,
        private fb: FormBuilder,
        private _CAMERA: Camera,
        public toast: ToastProvider,
        public emailCtr: EmailComposer,
        public authService: AuthProvider,

    ) {
    }

    ngOnInit() {
        this.correos = ['nahirsaddi@gmail.com', 'silviroa@gmail.com', 'celeste.carolina.s@gmail.com']
    }


    tomarFoto() {
        let options: CameraOptions = {
            destinationType: this._CAMERA.DestinationType.DATA_URL,
            correctOrientation: true
        } as CameraOptions;

        // sacamos la foto
        this._CAMERA.getPicture(options).then((imageData) => {
            this.imagen = `data:image/jpeg;base64,${imageData}`;
            this._attachment.push(this.imagen);
        })
            .catch(error => {
                this.toast.danger('Error al sacar la foto.');
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
                this.toast.danger('Error adjuntando archivo');
            });

    }

    async armarCorreo() {
        if (this.to.length > 0 && this.asunto && this.mensaje && this._attachment.length > 0) {
            await this.authService.enviarCorreo(this.to, this.asunto, this.mensaje, this._attachment);
        }
    }
}
