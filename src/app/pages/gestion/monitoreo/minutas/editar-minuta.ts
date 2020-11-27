import { NavController, NavParams } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

// CORE
import { Component, OnInit, Input } from '@angular/core';
// providders
import { ToastProvider } from 'src/providers/toast';
import { IPageGestion } from '../../../../../interfaces/pagesGestion';
import { AuthProvider } from 'src/providers/auth/auth';
// import { Principal } from './../../principal';
import * as moment from 'moment/moment';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { NetworkProvider } from 'src/providers/network';
import { Router } from '@angular/router';

@Component({
    selector: 'app-editar-minuta',
    templateUrl: 'editarMinuta.html',
    styles: ['../../registroProblema.scss']

})

export class EditarMinutaComponent implements OnInit {
    public origen;
    @Input() titulo: string;
    @Input() dataPage: any;
    public minuta;
    public backPage: IPageGestion;
    public form: FormGroup;
    public loader: boolean;
    public idMinutaSQL = null;
    public idMinutaMongo = null;
    public descripcion;
    public fechaActual = new Date();
    public anio = moment(this.fechaActual).year() + 2;
    // public fechaActual = new Date().toISOString();
    constructor(
        public navCtrl: NavController,
        private _FORM: FormBuilder,
        public toast: ToastProvider,
        public authService: AuthProvider,
        public datosGestion: DatosGestionProvider,
        public network: NetworkProvider,
        public navParams: NavParams,
        public router: Router

    ) {
        this.minuta = this.navParams.get('minuta') ? this.navParams.get('minuta') : '';
        this.origen = this.navParams.get('origen') ? this.navParams.get('origen') : '';
        if (!this.minuta) {
            this.router.navigate(['gestion'], {queryParams: { page: 'listadoMinutas', data: this.dataPage, origen: this.origen }});
            // this.navCtrl.push(Principal, { page: 'listadoMinutas', data: this.dataPage, origen: this.origen });
            this.toast.success('ERROR AL INTENTAR EDITAR');
        }
        this.idMinutaSQL = this.minuta.idMinuta;
        this.idMinutaMongo = this.minuta.idMongo;
        this.form = this._FORM.group({
            quienRegistra: [this.minuta.quienRegistra, Validators.required],
            fecha: [this.minuta.fecha, Validators.required],
            participantes: [this.minuta.participantes],
            temas: [this.minuta.temas],
            conclusiones: [this.minuta.conclusiones],
            fechaProxima: [this.minuta.fechaProxima],
            lugarProxima: [this.minuta.lugarProxima],
        });
    }

    ngOnInit() {
        this.loader = false;
        this.descripcion = this.minuta.origen;
    }

    async guardar() {
        this.loader = true;
        try {
            await this.controlGuardar();
            this.loader = false;
            this.router.navigate(['gestion'], {queryParams: { page: 'listadoMinutas', data: this.dataPage, origen: this.origen }});
            // this.navCtrl.push(Principal, { page: 'listadoMinutas', data: this.dataPage, origen: this.origen });
            this.toast.success('SE REGISTRO CORRECTAMENTE');
        } catch (error) {
            this.loader = false;
            this.toast.danger('ERROR REGISTRANDO!');
        }

    }


    async controlGuardar() {
        const estadoDispositivo = this.network.getCurrentNetworkStatus();
        if (this.idMinutaSQL) {
            this.datosGestion.updateMinuta(this.idMinutaSQL, this.form.value, this.descripcion);
            const unaMinuta = await this.datosGestion.obtenerMinuta(this.idMinutaSQL)
            if (estadoDispositivo === 'online') {
                await this.datosGestion.patchMongoMinuta(unaMinuta, this.idMinutaMongo);
                // Seteamos como actualizado el registro
                this.datosGestion.updateActualizacionMinuta(unaMinuta, this.idMinutaMongo);
            }
        } else {
            this.toast.success('PARAMETROS INCORRECTOS');
        }

    }

    verProblema(problema) {
        this.router.navigate(['gestion'],{queryParams: { page: 'VisualizarProblema', registroProblema: problema, origen: this.origen }});
        // this.navCtrl.push(Principal, { page: 'VisualizarProblema', registroProblema: problema, origen: this.origen });
    }

}
