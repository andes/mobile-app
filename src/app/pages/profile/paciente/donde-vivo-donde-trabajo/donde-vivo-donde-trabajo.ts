import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from '@ionic/angular';

import { PacienteProvider } from 'src/providers/paciente';
import { ConstanteProvider } from 'src/providers/constantes';
import { ToastProvider } from 'src/providers/toast';
import { AuthProvider } from 'src/providers/auth/auth';


declare var google;

// @IonicPage()
@Component({
    selector: 'app-page-donde-vivo-trabajo',
    templateUrl: 'donde-vivo-donde-trabajo.html',
})
export class DondeVivoDondeTrabajoPage implements OnInit{

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

    public direccion = '';
    public localidad = '';
    public provincia = '';
    public inProgress = false;
    public paciente: any;
    private ranking: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        public toast: ToastProvider,
        public assetProvider: ConstanteProvider,
        public pacienteProvider: PacienteProvider,
        public alertCtrl: AlertController,
        public authService: AuthProvider,
    ) {
    }

    ngOnInit() {
        console.log('onInit');

        const pacienteId = this.authService.user.pacientes[0].id;
        this.pacienteProvider.get(pacienteId).then((paciente: any) => {
            this.paciente = paciente;
            this.ranking = 0;
            if (this.paciente.direccion.length > 0) {
                const dir = this.paciente.direccion[0];
                if (dir) {
                    this.localidad = dir.ubicacion.localidad.nombre;
                    this.direccion = dir.valor;
                    this.provincia = dir.ubicacion.provincia.nombre;
                }
            }
        });
    }

    onSave() {
        if (this.direccion.length && this.provincia.length && this.localidad.length) {
            const direccion = {
                ranking: this.ranking,
                valor: this.direccion,
                codigoPostal: '0',
                ubicacion: {
                    localidad: {
                        nombre: this.localidad
                    },
                    provincia: {
                        nombre: this.provincia
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

            const data = {
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
            });

        }
    }
}
