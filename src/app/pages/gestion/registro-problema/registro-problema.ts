import { NavController, NavParams } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { EmailComposer } from '@ionic-native/email-composer';

// CORE
import { Component, OnInit, Input, ɵConsole } from '@angular/core';
// providders
import { ToastProvider } from 'src/providers/toast';
import { IPageGestion } from '../../../../interfaces/pagesGestion';
import { AuthProvider } from 'src/providers/auth/auth';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import * as moment from 'moment/moment';
import { NetworkProvider } from 'src/providers/network';

@Component({
    selector: 'app-registro-problema',
    templateUrl: 'registro-problema.html',
    styles: ['registro-problema.scss']

})

export class RegistroProblemaComponent implements OnInit {
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


    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private _FORM: FormBuilder,
        private _CAMERA: Camera,
        public toast: ToastProvider,
        public emailCtr: EmailComposer,
        public authService: AuthProvider,
        public datosGestion: DatosGestionProvider,
        public network: NetworkProvider

    ) {
        this.form = this._FORM.group({
            responsable: ['', Validators.required],
            plazo: ['', Validators.required],
            problema: ['', Validators.required],
            estado: ['Pendiente'],
            fechaRegistro: [new Date().toISOString()]

        });
    }

    ngOnInit() {
        this.dataPage = this.navParams.get('data') ? this.navParams.get('data') : '';
        this.origen = this.navParams.get('origen') ? this.navParams.get('origen') : '';
        this.idMinutaSQL = this.navParams.get('idMinutaSQL') ? this.navParams.get('idMinutaSQL') : '';

        this.idMinutaMongo = this.navParams.get('idMinutaMongo') ? this.navParams.get('idMinutaMongo') : '';
        this.loader = false;
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
                this._attachment.push(this.imagen);
            }).catch(error => {
                this.toast.danger('No se adjunto archivo');
            });

    }

    async guardar() {
        this.loader = true;
        const descripcion = this.dataPage ? (this.dataPage.descripcion) : this.origen.titulo;
        try {
            const resultado =
            await this.datosGestion.
            insertProblemas(this.form.value, this._attachment, descripcion, 1, null, this.idMinutaSQL, this.idMinutaMongo);
            if (resultado) {
                const estadoDispositivo = this.network.getCurrentNetworkStatus();
                if (estadoDispositivo === 'online') {
                    // guardamos en mongo
                    const problemaRegistrado: any = await this.datosGestion.postMongoProblemas(resultado)
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
