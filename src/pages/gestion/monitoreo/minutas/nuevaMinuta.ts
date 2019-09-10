import { AlertController, NavController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { EmailComposer } from '@ionic-native/email-composer';

// CORE
import { Component, OnInit, Input, ɵConsole } from '@angular/core';
// providders
import { ToastProvider } from '../../../../providers/toast';
import { IPageGestion } from 'interfaces/pagesGestion';
import { AuthProvider } from '../../../../providers/auth/auth';
import { Principal } from './../../principal';
import { RegistroProblema } from './../../registroProblema';
import { DatosGestionProvider } from '../../../../providers/datos-gestion/datos-gestion.provider';
import * as moment from 'moment/moment';
import { NetworkProvider } from '../../../../providers/network';
import { VisualizarProblema } from '../../visualizarProblema';

@Component({
    selector: 'nueva-minuta',
    templateUrl: 'nueva-minuta.html',
    styles: ['../../registroProblema.scss']

})

export class NuevaMinuta implements OnInit {
    @Input() origen;
    @Input() titulo: String;
    @Input() dataPage: any;
    @Input() activePage: IPageGestion;
    public backPage: IPageGestion;
    public form: FormGroup;
    public loader: boolean;
    public idMinutaSQL = null;
    public minuta;
    public idMinutaMongo = null;
    public problemas: any = [];
    public descripcion;
    public fechaActual = new Date();
    public anio = moment(this.fechaActual).year() + 2;
    callback = data => {
        this.problemas.push(data);
    };
    // public fechaActual = new Date().toISOString();
    constructor(public navCtrl: NavController,

        private _FORM: FormBuilder,
        private _CAMERA: Camera,
        public toast: ToastProvider,
        public emailCtr: EmailComposer,
        public authService: AuthProvider,
        public datosGestion: DatosGestionProvider,
        public network: NetworkProvider

    ) {
        let nombreCompleto = authService.user.nombre + ' ' + authService.user.apellido
        this.form = this._FORM.group({
            'quienRegistra': [nombreCompleto, Validators.required],
            'fecha': [new Date().toISOString(), Validators.required],
            'participantes': [''],
            'temas': [''],
            'conclusiones': [''],
            'fechaProxima': [''],
            'lugarProxima': [''],
        });
    }

    ngOnInit() {
        this.loader = false;
        this.descripcion = this.dataPage ? (this.dataPage.descripcion) : this.origen.titulo;
    }

    async guardar() {
        this.loader = true;
        try {
            await this.controlGuardar();
            this.loader = false;
            this.backPage = Object.assign({}, this.activePage);
            this.navCtrl.push(Principal, { page: 'listadoMinutas', data: this.dataPage, origen: this.origen });
            this.toast.success('SE REGISTRO CORRECTAMENTE');
        } catch (error) {
            this.loader = false;
            this.toast.danger('ERROR REGISTRANDO!');
        }

    }



    async registrarProblemas() {
        this.loader = true;
        try {
            await this.controlGuardar();
            this.loader = false;
            this.navCtrl.push(RegistroProblema, {
                origen: this.origen, data: this.dataPage, idMinutaSQL: this.idMinutaSQL, idMinutaMongo: this.idMinutaMongo, callback: this.callback
            });
        } catch (error) {
            this.loader = false;
            this.toast.danger('ERROR REGISTRANDO!');
        }
    }


    async controlGuardar() {
        let estadoDispositivo = this.network.getCurrentNetworkStatus();
        if (this.idMinutaSQL) {
            this.datosGestion.updateMinuta(this.idMinutaSQL, this.form.value, this.descripcion);
            let minuta = await this.datosGestion.obtenerMinuta(this.idMinutaSQL)
            if (estadoDispositivo === 'online') {
                await this.datosGestion.patchMongoMinuta(minuta, this.idMinutaMongo);
                // Seteamos como actualizado el registro
                this.datosGestion.updateActualizacionMinuta(minuta, this.idMinutaMongo);
            }
        } else {
            this.minuta = await this.datosGestion.insertMinuta(this.form.value, this.descripcion, 1, null);
            if (this.minuta) {
                this.toast.success('MINUTA GUARDADA');
                this.idMinutaSQL = this.minuta.idMinuta;
                if (estadoDispositivo === 'online') {
                    // guardamos en mongo
                    let minutaRegistrada: any = await this.datosGestion.postMongoMinuta(this.minuta);
                    this.idMinutaMongo = minutaRegistrada._id;
                    // Seteamos como actualizado el registro
                    this.datosGestion.updateActualizacionMinuta(this.minuta, this.idMinutaMongo);
                }
            }
        }

    }

    verProblema(problema) {
        this.navCtrl.push(Principal, { page: 'VisualizarProblema', registroProblema: problema, origen: this.origen });
    }

}
