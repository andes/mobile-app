import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PacienteMPIService } from '../../../../providers/paciente-mpi';
import * as moment from 'moment';
import { ToastProvider } from '../../../../providers/toast';


@Component({
    selector: 'page-registro-paciente',
    templateUrl: 'registro-paciente.html',
})
export class RegistroPacientePage implements OnInit {
    estado: String;
    loading: any;
    paciente: any = {};
    public textoLibre: string = null;
    inProgress = true;
    saving = false;
    ngOnInit() {

    }

    constructor(
        public storage: Storage,
        public navCtrl: NavController,
        public navParams: NavParams,
        private toastCtrl: ToastProvider,
        public mpiService: PacienteMPIService) {

    }

    volver() {
        this.navCtrl.pop();
    }

    save() {
        this.saving = true;
        this.mpiService.save(this.paciente).then(status => {
            this.saving = false;
            this.navCtrl.pop();
            this.toastCtrl.success('PACIENTE REGISTRADO CON EXITO');
        }).catch(() => {
            this.toastCtrl.danger('ERROR AL GUARDAR');
            this.saving = false;
        });
    }

    ionViewDidLoad() {
        this.inProgress = true;
        let datos = this.navParams.get('datos');
        let scan = this.navParams.get('scan');
        let search = {
            type: 'simplequery',
            apellido: datos.apellido.toString(),
            nombre: datos.nombre.toString(),
            documento: datos.documento.toString(),
            sexo: datos.sexo.toString(),
            escaneado: true
        }

        this.mpiService.get(search).then((resultado: any[]) => {
            if (resultado.length) {
                this.paciente = resultado[0];

                this.mpiService.getById(this.paciente.id).then((pacUpdate: any) => {
                    if (pacUpdate) {
                        this.paciente = pacUpdate;
                        this.estado = this.paciente.estado;
                        if (this.paciente.estado === 'temporal') {
                            this.paciente.estado = 'validado';
                            this.paciente.scan = scan;
                            this.paciente.nombre = datos.nombre.toUpperCase();
                            this.paciente.apellido = datos.apellido.toUpperCase();
                            this.paciente.fechaNacimiento = moment(datos.fechaNacimiento, 'DD/MM/YYYY');
                            this.paciente.sexo = datos.sexo.toLowerCase();
                            this.paciente.documento = datos.documento;
                        }
                    } else {
                        this.estado = 'nuevo';
                        this.paciente = {
                            estado: 'validado',
                            scan: scan,
                            nombre: datos.nombre.toUpperCase(),
                            apellido: datos.apellido.toUpperCase(),
                            fechaNacimiento: moment(datos.fechaNacimiento, 'DD/MM/YYYY'),
                            sexo: datos.sexo.toLowerCase(),
                            documento: datos.documento
                        };
                    }
                    this.inProgress = false;
                });
            } else {
                // No existe el paciente
                this.estado = 'nuevo';
                this.paciente = {
                    estado: 'validado',
                    scan: scan,
                    nombre: datos.nombre.toUpperCase(),
                    apellido: datos.apellido.toUpperCase(),
                    fechaNacimiento: moment(datos.fechaNacimiento, 'DD/MM/YYYY'),
                    sexo: datos.sexo.toLowerCase(),
                    genero: datos.sexo.toLowerCase(),
                    documento: datos.documento
                };
                this.inProgress = false;
            }
        })
    }

}
