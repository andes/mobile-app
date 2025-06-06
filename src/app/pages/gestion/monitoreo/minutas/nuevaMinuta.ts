import { NavController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

// CORE
import { Component, OnInit, Input, ɵConsole } from '@angular/core';
// providers
import { ToastProvider } from 'src/providers/toast';
import { IPageGestion } from './../../../../../interfaces/pagesGestion';
import { AuthProvider } from 'src/providers/auth/auth';
// import { Principal } from './../../principal';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import * as moment from 'moment/moment';
import { NetworkProvider } from 'src/providers/network';
// import { VisualizarProblema } from '../../visualizarProblema';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nueva-minuta',
    templateUrl: 'nueva-minuta.html',
    styleUrls: [
        '../../registro-problema/registro-problema.scss'
    ]

})

export class NuevaMinutaComponent implements OnInit {
    @Input() origen: any;
    @Input() titulo: string;
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
    pickerOptions = {
        cssClass: '.picker'
    };

    callback = data => {
        this.problemas.push(data);
    };
    // public fechaActual = new Date().toISOString();
    constructor(
        public navCtrl: NavController,
        private _FORM: FormBuilder,
        private _CAMERA: Camera,
        public toast: ToastProvider,
        public emailCtr: EmailComposer,
        public authService: AuthProvider,
        public datosGestion: DatosGestionProvider,
        public network: NetworkProvider,
        public router: Router

    ) {
        const nombreCompleto = authService.user.nombre + ' ' + authService.user.apellido;
        this.form = this._FORM.group({
            quienRegistra: [nombreCompleto, Validators.required],
            fecha: [new Date().toISOString(), Validators.required],
            participantes: [''],
            temas: [''],
            conclusiones: [''],
            fechaProxima: [''],
            lugarProxima: [''],
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
            const queryParams = {
                page: 'listadoMinutas',
                data: this.dataPage,
                origen: this.origen
            };
            this.router.navigate(['gestion'], { queryParams });
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
        } catch (error) {
            this.loader = false;
            this.toast.danger('ERROR REGISTRANDO!');
        }
    }


    async controlGuardar() {
        const estadoDispositivo = this.network.getCurrentNetworkStatus();
        if (this.idMinutaSQL) {
            this.datosGestion.updateMinuta(this.idMinutaSQL, this.form.value, this.descripcion);
            const minuta = await this.datosGestion.obtenerMinuta(this.idMinutaSQL);
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
                    const minutaRegistrada: any = await this.datosGestion.postMongoMinuta(this.minuta);
                    this.idMinutaMongo = minutaRegistrada._id;
                    // Seteamos como actualizado el registro
                    this.datosGestion.updateActualizacionMinuta(this.minuta, this.idMinutaMongo);
                }
            }
        }

    }

    verProblema(problema) {
        // this.navCtrl.push(Principal, { page: 'VisualizarProblema', registroProblema: problema, origen: this.origen });
        this.router.navigate(['gestion'], { queryParams: { page: 'VisualizarProblema', registroProblema: problema, origen: this.origen } });
    }

}
