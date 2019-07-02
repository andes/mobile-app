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
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';

@Component({
    selector: 'registroProblema',
    templateUrl: 'registroProblema.html',
    styles: ['registroProblema.scss']

})

export class RegistroProblema implements OnInit {

    @Input() titulo: String;
    @Input() dataPage: any;
    public backPage: IPageGestion;
    public form: FormGroup;
    public _attachment: any = [];
    public imagen: string = null;
    public correos: any = [];
    public to: any = [];
    public asunto: string;
    public mensaje: string;
    public loader: boolean;
    constructor(public navCtrl: NavController,
        private _FORM: FormBuilder,
        private _CAMERA: Camera,
        public toast: ToastProvider,
        public emailCtr: EmailComposer,
        public authService: AuthProvider,
        public datosGestion: DatosGestionProvider,

    ) {
        this.form = this._FORM.group({
            'quienRegistra': ['', Validators.required],
            'responsable': ['', Validators.required],
            'plazo': ['', Validators.required],
            'problema': ['', Validators.required],
            'adjuntos': ['']

        });
    }

    ngOnInit() {
        this.loader = false;

        // this.asunto = 'ANDES -' + this.titulo + '- ';
        // this.correos = [
        //     { id: 'Juan Gabriel', correo: 'jgabriel@neuquen.gov.ar' },
        //     { id: 'Hugo Spinelli', correo: 'ugospinelli09@gmail.com' },
        //     { id: 'Sole Rey', correo: 'solerey2004@gmail.com' },
        //     { id: 'Caro Celeste', correo: 'celeste.carolina.s@gmail.com' },
        //     { id: 'Sivi Roa', correo: 'silviroa@gmail.com' },
        //     { id: 'Nahir Saddi', correo: 'nahirsaddi@gmail.com' }]
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

    guardar() {
        // let to = this.form.controls['to'].value,
        //     subject: string = this.form.controls['subject'].value,
        //     message: string = this.form.controls['message'].value;
        console.log(this.form.value)
        this.datosGestion.insertProblemas(this.form.value, this._attachment)
        // if (this._attachment.length > 0) { //No necesariamente tiene que mandar adjuntos
        // this.authService.enviarCorreo(to, subject, message, this._attachment).then(result => {
        //     this.toast.success('EL CORREO FUE ENVIADO');
        //     this.loader = false;
        //     this.cambiarPagina();
        // }).catch(error => {
        //     this.loader = false;
        //     if (error) {
        //         this.toast.danger('EL CORREO NO PUDO SER ENVIADO');
        //     }
        // });
        // } else {
        //     this.toast.danger('Falta adjuntar archivo');
        // }
    }
    delete(item) {
        if (this._attachment.length > 0) {
            this._attachment.splice(item, 1);
        }
    }

}
