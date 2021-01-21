import { NavController, NavParams } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
// CORE
import { Component, OnInit, Input, ɵConsole } from '@angular/core';
// providers
import { IPageGestion } from '../../../../interfaces/pagesGestion';
import * as moment from 'moment/moment';
import { ToastProvider } from 'src/providers/toast';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { NetworkProvider } from 'src/providers/network';

@Component({
    selector: 'app-registro-problema',
    templateUrl: 'registro-problema.html',
})

export class RegistroProblemaComponent implements OnInit {
    @Input() origen;
    @Input() idMinutaSQL;
    @Input() idMinutaMongo;
    @Input() titulo: string;
    @Input() dataPage: any;
    @Input() callback: any;
    public backPage: IPageGestion;
    public form: FormGroup;
    public attachment: any = [];
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
        private navCtrl: NavController,
        private navParams: NavParams,
        private _FORM: FormBuilder,
        private _CAMERA: Camera,
        private toast: ToastProvider,
        private datosGestion: DatosGestionProvider,
        private network: NetworkProvider

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
                this.attachment.push(this.imagen);
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
                    insertProblemas(this.form.value, this.attachment, descripcion, 1, null, this.idMinutaSQL, this.idMinutaMongo);
            if (resultado) {
                const estadoDispositivo = this.network.getCurrentNetworkStatus();
                if (estadoDispositivo === 'online') {
                    // guardamos en mongo
                    const problemaRegistrado: any = await this.datosGestion.postMongoProblemas(resultado);
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
        if (this.attachment.length > 0) {
            this.attachment.splice(item, 1);
        }
    }
}
