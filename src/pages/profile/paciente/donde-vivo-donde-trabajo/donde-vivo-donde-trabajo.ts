import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { PacienteProvider } from '../../../../providers/paciente';
import { ConstanteProvider } from '../../../../providers/constantes';
import { ToastProvider } from '../../../../providers/toast';


declare var google;

// @IonicPage()
@Component({
    selector: 'page-donde-vivo-donde-trabajo',
    templateUrl: 'donde-vivo-donde-trabajo.html',
})
export class DondeVivoDondeTrabajoPage {

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

    public _direccion = '';
    public _localidad = '';
    public _provincia = '';
    public inProgress = false;
    public paciente: any;
    private ranking: number;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        public toast: ToastProvider,
        public assetProvider: ConstanteProvider,
        public pacienteProvider: PacienteProvider,
        public alertCtrl: AlertController,
    ) {
    }

    ionViewDidLoad() {

        this.paciente = this.pacienteProvider.paciente;
        this.ranking = 0;
        if (this.paciente.direccion.length > 0) {
            let dir = this.paciente.direccion[0];
            if (dir) {
                this._localidad = dir.ubicacion.localidad.nombre;
                this._direccion = dir.valor;
                this._provincia = dir.ubicacion.provincia.nombre;
            }
        }
    }

    onSave() {
        if (this._direccion.length && this._provincia.length && this._localidad.length) {
            let direccion = {
                ranking: this.ranking,
                valor: this._direccion,
                codigoPostal: '0',
                ubicacion: {
                    localidad: {
                        nombre: this._localidad
                    },
                    provincia: {
                        nombre: this._provincia
                    },
                    pais: {
                        nombre: 'Argentina'
                    }
                }
            }

            // si existe lo reemplazamos
            if (this.paciente.direccion) {
                this.paciente.direccion[0] = direccion;
            } else {
                // si no existe lo agregamos sobre el array
                this.paciente.direccion.push(direccion);
            }

            let data = {
                op: 'updateDireccion',
                direccion: this.paciente.direccion
            };
            this.inProgress = true;
            this.pacienteProvider.update(this.paciente.id, data).then(() => {
                this.inProgress = false;
                this.toast.success('DATOS MODIFICADOS CORRECTAMENTE');
                // this.navCtrl.pop();
            }).catch(() => {
                this.inProgress = false;
                this.toast.success('ERROR AL GUARDAR');
            })

        }
    }
}
