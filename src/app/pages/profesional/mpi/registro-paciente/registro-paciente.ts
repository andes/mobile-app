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
            this.router.navigate(['/home/paciente']);
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
                // CASO 1: 100% - Ya registrado
                this.actualizarDatosPaciente(resultado[0], datos, scan);
                this.estado = 'validado';
            } else {
                // Buscamos sugeridos para ver si hay posibles duplicados (> 94%)
                this.mpiService.match(datos).then((sugeridos: any[]) => {
                    const candidatos = sugeridos.filter(s => s._score >= 0.94);
                    this.prepararPacienteNuevo(datos, scan); // Primero creamos el objeto base
                    this.paciente.estado = 'validado';

                    if (candidatos.length > 0) {
                        // Ahora que el objeto existe, le añadimos los duplicados
                        this.paciente.posibleDuplicado = candidatos.map(c => ({
                            id: c.id,
                            score: c._score,
                            fecha: new Date()
                        }));
                    }
                    this.inProgress = false;
                }).catch(() => {
                    this.prepararPacienteNuevo(datos, scan);
                    this.inProgress = false;
                });
            }
        });
    }

    private actualizarDatosPaciente(pacienteEncontrado, datosScan, scanText) {
        this.paciente = pacienteEncontrado;
        this.paciente.scan = scanText;
        this.paciente.nombre = datosScan.nombre.toUpperCase();
        this.paciente.apellido = datosScan.apellido.toUpperCase();
        this.paciente.fechaNacimiento = moment(datosScan.fechaNacimiento, 'DD/MM/YYYY');
        this.paciente.sexo = datosScan.sexo.toLowerCase();
        this.paciente.documento = datosScan.documento;
        this.inProgress = false;
    }

    private prepararPacienteNuevo(datos, scan) {
        this.paciente = {
            nombre: datos.nombre.toUpperCase(),
            apellido: datos.apellido.toUpperCase(),
            fechaNacimiento: moment(datos.fechaNacimiento, 'DD/MM/YYYY'),
            sexo: datos.sexo.toLowerCase(),
            documento: datos.documento,
            scan: scan,
            genero: datos.sexo.toLowerCase()
        };
        this.estado = 'nuevo';
    }

    public irAlInicio() {
        this.router.navigate(['/home/paciente']);
    }

}
