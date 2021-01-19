import { AlertController, NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { EmailComposer } from '@ionic-native/email-composer';

// CORE
import { Component, OnInit, Input } from '@angular/core';
// providders
import { ToastProvider } from 'src/providers/toast';
import { IPageGestion } from '../../../../interfaces/pagesGestion';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-monitoreo',
    templateUrl: 'monitoreo.html',
    styleUrls: [
        'monitoreo.scss'
    ]
})

export class MonitoreoComponent implements OnInit {

    @Input() titulo: string;
    @Input() dataPage: any;
    public backPage: IPageGestion;
    public form: FormGroup;
    public attachment: any = [];
    public imagen: string = null;
    public correos: any = [];
    public to: any = [];
    public asunto: string;
    public mensaje: string;
    public loader: boolean;
    constructor(
        public navCtrl: NavController,
        private _FORM: FormBuilder,
        private _CAMERA: Camera,
        public toast: ToastProvider,
        public emailCtr: EmailComposer,
        public authService: AuthProvider,
        private router: Router

    ) {
        this.form = this._FORM.group({
            to: ['', Validators.required],
            subject: ['', Validators.required],
            message: ['', Validators.required]

        });
    }

    ngOnInit() {
        this.loader = false;
        this.asunto = 'ANDES -' + this.titulo + '- ';
        this.correos = [
            { id: 'Andrea Peve', correo: 'apeve03@gmail.com' },
            { id: 'Jorge Ninno', correo: 'jorgeninno@gmail.com' },
            { id: 'Andrea Echauri', correo: 'mariaandreaechauri@gmail.com' },
            { id: 'Pablo Jalil', correo: 'pacjalil@gmail.com' },
            { id: 'Dir. Prov. de Administración', correo: 'mariaandreaechauri@gmail.com' },
            { id: 'Dir. Prov. de APS', correo: 'destaillatssolange@yahoo.com.ar' },
            { id: 'Dir. Prov. de Organización de Establecimientos', correo: 'aquitaniabq@gmail.com' },
            { id: 'Dir. Prov. de Recursos Humanos', correo: 'sfilipponi@hotmail.com' },
            { id: 'Dir. Prov. de Gestión de Profesionales de la Salud', correo: 'ctamburininqn@gmail.com' },
            { id: 'Dir. Prov. de Recupero Financiero', correo: 'danielaromanonqn@yahoo.com.ar' },
            { id: 'Dir. Prov. de Recursos Físicos y Biomédicos', correo: 'ovmneder@gmail.com' }
        ];
    }

    tomarFoto() {
        const options: CameraOptions = {
            destinationType: this._CAMERA.DestinationType.DATA_URL,
            correctOrientation: true
        };

        // sacamos la foto
        this._CAMERA.getPicture(options).then((imageData: any) => {
            this.imagen = `data:image/jpeg;base64,${imageData}`;
            this.attachment.push({
                filename: 'adjunto.jpg',
                content: this.imagen,
                encoding: 'base64'
            }
            );
        }).catch(error => {
            this.toast.danger('Error al sacar la foto.');
        });
    }

    seleccionarArchivo() {
        const options: CameraOptions = {
            sourceType: this._CAMERA.PictureSourceType.PHOTOLIBRARY,
            destinationType: this._CAMERA.DestinationType.DATA_URL,
            encodingType: this._CAMERA.EncodingType.JPEG,
            correctOrientation: true

        };

        this._CAMERA.getPicture(options)
            .then((imageData: any) => {
                this.imagen = `data:image/jpeg;base64,${imageData}`;
                this.attachment.push({
                    filename: 'adjunto.jpg',
                    content: this.imagen,
                    encoding: 'base64'
                });
            }).catch(error => {
                this.toast.danger('No se adjunto archivo');
            });

    }

    armarCorreo() {
        const to = this.form.controls.to.value;
        const subject: string = this.form.controls.subject.value;
        const message: string = this.form.controls.message.value;

        // if (this.attachment.length > 0) { //No necesariamente tiene que mandar adjuntos
        this.loader = true;
        this.authService.enviarCorreo(to, subject, message, this.attachment).then(result => {
            this.toast.success('EL CORREO FUE ENVIADO');
            this.loader = false;
            this.cambiarPagina();
        }).catch(error => {
            this.loader = false;
            if (error) {
                this.toast.danger('EL CORREO NO PUDO SER ENVIADO');
            }
        });
        // } else {
        //     this.toast.danger('Falta adjuntar archivo');
        // }
    }
    delete(item) {
        if (this.attachment.length > 0) {
            this.attachment.splice(item, 1);
        }
    }

    cambiarPagina() {
        this.router.navigate(['gestion']);
        // this.navCtrl.push(Principal);

    }
}
