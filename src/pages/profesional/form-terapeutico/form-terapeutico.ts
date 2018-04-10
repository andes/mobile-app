import { EspecialidadesFTProvider } from './../../../providers/especialidadesFT';
import { formTerapeuticoDetallePage } from './form-terapeutico-detalle';
import { formTerapeuticoArbolPage } from './form-terapeutico-arbol';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../../providers/auth/auth';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FtpProvider } from '../../../providers/ftp';

@Component({
    selector: 'form-terapeutico',
    templateUrl: 'form-terapeutico.html',
})

export class formTerapeuticoPage {
    mostrarMenu: boolean = false;
    private capitulos: any[];
    private filtrados: any[];
    private padres: any[];
    especialidades: any[];
    nombre: string;
    os: string;
    especialidadSelected: string = "";
    carroSelected: boolean = null;
    nivelSelected: string = "";
    niveles = ['1', '2', '3', '4', '5', '6', '7', '8', '8 y Serv Rehab (HBR)', '8 (NEO)', '8 (UTI)'];

    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public formBuilder: FormBuilder,
        public ftp: FtpProvider,
        public esp: EspecialidadesFTProvider,
        public authProvider: AuthProvider,


    ) { }

    ionViewDidLoad() {
        this.esp.get({}).then((dataEsp: any) => {
            this.especialidades = dataEsp;
        })
    }

    onSelectEspecialidad() {
        console.log(this.especialidadSelected)
    }

    onSelectCarro() {
        console.log(this.carroSelected);
    }

    onSelectComplejidad() {
        console.log(this.nivelSelected);
    }

    onKeyPress($event, tag) {
    }

    buscarMedicamentos(params) {
        this.filtrados = [];
        this.ftp.get(params).then((data: any) => {
            this.filtrados = data;
            console.log('filtrados ', this.filtrados);
        });
    }

    onCancel() {
        this.filtrados = [];
    }

    itemSelected(filtrado) {
        this.ftp.get({ padre: filtrado.idpadre }).then((data: any) => {
            this.padres = data;
            let params = {
                item: filtrado,
                padres: this.padres
            }
            this.navCtrl.push(formTerapeuticoDetallePage, params);
        });
    }

    buscar() {
        let params = {
            nombreMedicamento: this.nombre
        }
        if (this.especialidadSelected) {
            params['especialidad'] = (this.especialidadSelected as any).descripcion;
        }
        if (this.carroSelected) {
            params['carro'] = this.carroSelected;
        }
        if (this.nivelSelected) {
            params['nivel'] = this.nivelSelected;
        }
        this.buscarMedicamentos(params);
    }
    arbol() {
        console.log("hola arbol");
        this.ftp.get({ tree: 1, root:1 }).then((data: any) => {
            let params = {
                indice: data
            }
        this.navCtrl.push(formTerapeuticoArbolPage, params);
        });
        }
        
    }


