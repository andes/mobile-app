// import { AlertController } from '@ionic/angular';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { EmailComposer } from '@ionic-native/email-composer';

// CORE
import { Component, OnInit, Input, ɵConsole } from '@angular/core';
// providders
import { ToastProvider } from '../../../../providers/toast';
import { IPageGestion } from 'interfaces/pagesGestion';
import { AuthProvider } from '../../../../providers/auth/auth';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../../../providers/datos-gestion/datos-gestion.provider';
import { ifError } from 'assert';
import { NetworkProvider } from '../../../../providers/network';

@Component({
    selector: 'visualizar-minuta',
    templateUrl: 'visualizar-minuta.html',
    styles: ['../../visualizarProblema.scss']

})

export class VisualizarMinutaComponent implements OnInit {
    @Input() origen;
    @Input() minutaInput;
    @Input() titulo: String;
    @Input() dataPage: any;

    public minuta;
    public backPage: IPageGestion;
    public form: FormGroup;
    public _attachment: any = [];
    public imagen: string = null;
    public correos: any = [];
    public to: any = [];
    public asunto: string;
    public mensaje: string;
    public loader: boolean;
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
        public network: NetworkProvider,
        public navParams: NavParams

    ) {
        // this.form = this._FORM.group({
        //     'quienRegistra': ['', Validators.required],
        //     'responsable': ['', Validators.required],
        //     'plazo': ['', Validators.required],
        //     'minuta': ['', Validators.required],
        //     'adjuntos': [''],
        //     'estado': ['Pendiente'],
        //     'fechaRegistro': [new Date()]

        // });
    }

    ngOnInit() {
        this.loader = false;
        this.minuta = this.navParams.get('minuta') ? this.navParams.get('minuta') : '';

        console.log('minuta ', this.minuta);

    }

}
