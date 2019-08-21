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
import { DatosGestionProvider } from '../../../../providers/datos-gestion/datos-gestion.provider';
import * as moment from 'moment/moment';
import { NetworkProvider } from '../../../../providers/network';

@Component({
    selector: 'nueva-minuta',
    templateUrl: 'nueva-minuta.html',
    styles: ['../../registroProblema.scss']

})

export class NuevaMinuta implements OnInit {
    @Input() origen;
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
    public estado = 'Pendiente';
    public estadosArray = ['Pendiente', 'Resuelto', 'En Proceso']
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
            'pendientes': [''],
            'fechaProxima': [''],
            'lugarProxima': [''],
        });
    }

    ngOnInit() {
        this.loader = false;
    }

    async guardar() {
        this.loader = true;
        let descripcion = this.dataPage !== null ? this.dataPage.descripcion : null
        try {
            let resultado = await this.datosGestion.insertMinuta(this.form.value, this.origen.template, this.origen.titulo);
            if (resultado) {
                // let estadoDispositivo = this.network.getCurrentNetworkStatus();
                // if (estadoDispositivo === 'online') {
                //     // guardamos en mongo
                //     let problemaRegistrado: any = await this.datosGestion.postMongoProblemas(resultado)
                //     // Seteamos como actualizado el registro
                //     this.datosGestion.updateEstadoActualizacion(resultado, problemaRegistrado._id);
                // }
                this.loader = false;
                this.navCtrl.push(Principal, { page: 'listado', data: this.dataPage });

                this.toast.success('SE REGISTRO CORRECTAMENTE');
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


    // onSelectEstado() {;
    //     this.localidadName = this.localidades.find(item => item.localidadId === this.localidadSelect).nombre;
    // }
}
