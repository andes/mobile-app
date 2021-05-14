import { Component } from '@angular/core';
import { PacienteMPIService } from 'src/providers/paciente-mpi';
import * as moment from 'moment';
import { ToastProvider } from 'src/providers/toast';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-registro-paciente',
    templateUrl: 'registro-paciente.html',
})
export class RegistroPacientePage {
    estado: string;
    loading: any;
    public textoLibre: string = null;
    inProgress = true;
    saving = false;
    public paciente: any = {};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private toastCtrl: ToastProvider,
        private mpiService: PacienteMPIService) {
    }


    save() {
        this.saving = true;
        this.paciente.ignoreSuggestions = true;
        if (this.paciente.entidadesValidadoras) {
            if (this.paciente.entidadesValidadoras.length <= 0) {
                // Caso que el paciente existe y no tiene ninguna entidad validadora e ingresó como validado
                this.paciente.entidadesValidadoras.push('RENAPER');
            } else {
                const validador = this.paciente.entidadesValidadoras.find(entidad => entidad === 'RENAPER');
                if (!validador) {
                    this.paciente.entidadesValidadoras.push('RENAPER');
                }
            }
        } else {
            // El caso que el paciente no existe
            this.paciente.entidadesValidadoras = ['RENAPER'];
        }
        const paciente = this.paciente;
        this.mpiService.save(paciente).then(status => {
            this.saving = false;
            this.toastCtrl.success('PACIENTE REGISTRADO CON EXITO');
            this.router.navigate(['/home']);
        }).catch(() => {
            this.toastCtrl.danger('ERROR AL GUARDAR');
            this.saving = false;
        });
    }

    ionViewWillEnter() {
        this.inProgress = true;
        let datos;
        let scan;
        this.route.queryParams.subscribe(params => {
            datos = JSON.parse(params.datos);
            scan = params.scan;
        });
        const search = {
            documento: datos.documento.toString(),
            sexo: datos.sexo.toLowerCase(),
            activo: true,
            estado: 'validado'
        };

        this.mpiService.get(search).then((resultado: any[]) => {
            if (resultado.length) {
                this.paciente = resultado[0];
                this.estado = this.paciente.estado;
                this.paciente.scan = scan;
                this.paciente.nombre = datos.nombre.toUpperCase();
                this.paciente.apellido = datos.apellido.toUpperCase();
                this.paciente.fechaNacimiento = moment(datos.fechaNacimiento, 'DD/MM/YYYY');
                this.paciente.sexo = datos.sexo.toLowerCase();
                this.paciente.documento = datos.documento;
                this.inProgress = false;
            } else {
                // No existe el paciente
                this.estado = 'nuevo';
                this.paciente.nombre = datos.nombre.toUpperCase();
                this.paciente.apellido = datos.apellido.toUpperCase();
                this.paciente.fechaNacimiento = moment(datos.fechaNacimiento, 'DD/MM/YYYY');
                this.paciente.sexo = datos.sexo.toLowerCase();
                this.paciente.documento = datos.documento;
                this.paciente.scan = datos.scan;
                this.paciente.estado = 'validado';
                this.paciente.genero = datos.sexo.toLowerCase();
                this.inProgress = false;
            }
        });
    }

}
