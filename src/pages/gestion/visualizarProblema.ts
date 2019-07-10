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
    public estadosArray = ['Pendiente', 'Resuelto', 'En Proceso']
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
        public alertController: AlertController

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
        console.log('datos asdasdasd', this.origen)
        this.estadoTemporal = this.problema.ESTADO;
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

    // guardar() {

    //     console.log(this.form.value)
    //     console.log(this.origen, this.origen.template)
    //     this.datosGestion.insertProblemas(this.form.value, this._attachment, this.origen.template)

    // }
    delete(item) {
        if (this._attachment.length > 0) {
            this._attachment.splice(item, 1);
        }
    }

    async   traeDatos(problema) {
        console.log('imagenes', problema)
        this.imagenes = await this.datosGestion.obtenerImagenesProblemasPorId(problema.ID_PROBLEMA);
        console.log('id', this.imagenes)
    }


    // onSelectEstado() {;
    //     this.localidadName = this.localidades.find(item => item.localidadId === this.localidadSelect).nombre;
    // }

    editar() {
        this.edit = true;
        this.nuevoEstado = this.problema.ESTADO;

    }

    async confirmAlert() {
        console.log('aaaaa')
        const alert = await this.alertController.create({
            title: 'Confirm!',
            message: '¿Desea cambiar el estado?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                        this.problema.ESTADO = this.estadoTemporal;
                    }
                }, {
                    text: 'Aceptar',
                    handler: () => {
                        console.log('Confirm Okay');
                        this.problema.ESTADO = this.nuevoEstado
                        this.edit = false;
                        this.datosGestion.updateEstadoProblema(this.problema)
                    }
                }
            ]
        });

        await alert.present();
    }
}
