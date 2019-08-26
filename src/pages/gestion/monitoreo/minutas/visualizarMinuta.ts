// import { AlertController } from '@ionic/angular';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
// CORE
import { Component, OnInit, Input } from '@angular/core';
// providders
import { ToastProvider } from '../../../../providers/toast';
import { IPageGestion } from 'interfaces/pagesGestion';
import { AuthProvider } from '../../../../providers/auth/auth';
import { DatosGestionProvider } from '../../../../providers/datos-gestion/datos-gestion.provider';
import { ifError } from 'assert';
import { NetworkProvider } from '../../../../providers/network';
import { EditarMinuta } from './editar-minuta';

@Component({
    selector: 'visualizar-minuta',
    templateUrl: 'visualizar-minuta.html',
    styles: ['visualizarMinuta.scss']

})

export class VisualizarMinutaComponent implements OnInit {
    @Input() activePage: IPageGestion;
    @Input() minutaInput;
    @Input() titulo: String;
    @Input() dataPage: any;
    public origen;
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
        public toast: ToastProvider,
        public authService: AuthProvider,
        public datosGestion: DatosGestionProvider,
        public alertController: AlertController,
        public network: NetworkProvider,
        public navParams: NavParams,


    ) { }

    ngOnInit() {
        this.loader = false;
        this.minuta = this.navParams.get('minuta') ? this.navParams.get('minuta') : null;
        this.origen = this.navParams.get('origen') ? this.navParams.get('origen') : null;
    }


    editarMinuta() {
        this.backPage = Object.assign({}, this.activePage);
        this.navCtrl.push(EditarMinuta, {
            origen: this.origen, data: this.dataPage, minuta: this.minuta
        });
    }

}
