import { Component, OnInit } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { ActivatedRoute, Router } from '@angular/router';
// providers
import { ProfesionalProvider } from 'src/providers/profesional';
import * as moment from 'moment';
import { ToastProvider } from 'src/providers/toast';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-datos-profesional',
    templateUrl: 'datos-profesional.html',
    styleUrls: ['datos-profesional.scss'],
})

export class DatosProfesionalPage implements OnInit {
    inProgress = true;
    datos: any;
    profesional: any;
    validado = false;
    domicilioReal: string;
    domicilioLegal;
    domicilioProfesional;
    provincias: any[] = [];
    localidades: any[] = [];
    localidadRealName: any;
    localidadLegalName: any;
    localidadProfesionalName: any;
    direccionReal: string;
    provinciaReal: any;
    localidadReal: any;
    codigoPostalReal: any;
    direccionLegal: string;
    provinciaLegal: any;
    localidadLegal: any;
    codigoPostalLegal: any;
    direccionProfesional: string;
    provinciaProfesional: any;
    localidadProfesional: any;
    codigoPostalProfesional: any;
    editarDomReal = false;
    editarDomLegal = false;
    editarDomProfesional = false;
    public formProfesional: any;
    constructor(
        private router: ActivatedRoute,
        private route: Router,
        private toast: ToastProvider,
        public authProvider: AuthProvider,
        private profesionalProvider: ProfesionalProvider) {
    }

    ngOnInit() {
        this.router.queryParams.subscribe(params => {
            this.datos = JSON.parse(params.datos);

            let profesionalId;
            profesionalId = this.authProvider.user.profesionalId;

            this.profesionalProvider.validarProfesional({ documento: this.datos.documento, sexo: this.datos.sexo.toLowerCase(), nombre: this.datos.nombre, apellido: this.datos.apellido, fechaNacimiento: this.datos.fechaNacimiento }).then((data: any) => {
                if (data.profesional) {
                    this.profesional = data.profesional;

                    if (data.profesional.id === profesionalId) {

                        this.domicilioReal = this.profesional.domicilios[0];
                        this.domicilioLegal = this.profesional.domicilios[1];
                        this.domicilioProfesional = this.profesional.domicilios[2];

                        this.inProgress = false;
                        this.validado = true;
                    } else {
                        this.route.navigate(['profesional/scan-profesional']);
                        this.toast.danger('Sus datos no pudieron ser validados');
                    }

                }
            });
        });
    }

    confirmarDatos() {
        this.profesionalProvider.putProfesional(this.profesional).then(() => {
            this.toast.success('Datos guardados correctamente');
            this.route.navigate(['profesional/firma-profesional']);
        });
    }

    onSelectProvincia(tipo) {
        this.localidades = null;
        if (tipo === 'real') {
            this.localidadReal = null;
            this.codigoPostalReal = null;
            this.loadLocalidades(this.provinciaReal, 'real');
        } else if (tipo === 'legal') {
            this.localidadLegal = null;
            this.codigoPostalLegal = null;
            this.loadLocalidades(this.provinciaLegal, 'legal');
        } else {
            this.localidadProfesional = null;
            this.codigoPostalProfesional = null;
            this.loadLocalidades(this.provinciaProfesional, 'profesional');
        }
    }

    onSelectLocalidad(tipo) {
        if (this.localidadReal?._id || this.localidadLegal?._id || this.localidadProfesional?._id) {
            if (tipo === 'real') {
                this.localidadRealName = this.localidades.find(item => item._id === this.localidadReal._id).nombre;
                this.codigoPostalReal = this.localidades.find(item => item._id === this.localidadReal._id).codigoPostal;
            } else if (tipo === 'legal') {
                this.localidadLegalName = this.localidades.find(item => item._id === this.localidadLegal._id).nombre;
                this.codigoPostalLegal = this.localidades.find(item => item._id === this.localidadLegal._id).codigoPostal;
            } else {
                this.localidadProfesionalName = this.localidades.find(item => item._id === this.localidadProfesional._id).nombre;
                this.codigoPostalProfesional = this.localidades.find(item => item._id === this.localidadProfesional._id).codigoPostal;
            }
        } else {
            this.localidadRealName = null;
            this.codigoPostalReal = null;
            this.localidadLegalName = null;
            this.localidadProfesionalName = null;
        }
    }

    loadProvincias(tipo) {
        this.profesionalProvider.getProvincias().then((data: any) => {
            this.provincias = data;
            if (tipo === 'real') {
                this.provinciaReal = this.provincias.find(item => item._id === this.profesional.domicilios[0].ubicacion.provincia._id);
                this.loadLocalidades(this.provinciaReal, 'real');
            } else if (tipo === 'legal') {
                this.provinciaLegal = this.provincias.find(item => item._id === this.profesional.domicilios[1].ubicacion.provincia._id);
                this.loadLocalidades(this.provinciaLegal, 'legal');
            } else {
                this.provinciaProfesional = this.provincias.find(item => item._id === this.profesional.domicilios[2].ubicacion.provincia._id);
                this.loadLocalidades(this.provinciaProfesional, 'profesional');
            }
        });
    }

    loadLocalidades(provincia, tipo) {
        this.profesionalProvider.getLocalidades(provincia._id).then((data: any) => {
            this.localidades = data;

            if (tipo === 'real') {
                this.localidadReal = this.localidades.find(item => item._id === this.profesional.domicilios[0].ubicacion.localidad._id);
                this.editarDomReal = true;
                this.editarDomLegal = false;
                this.editarDomProfesional = false;
            } else if (tipo === 'legal') {
                this.localidadLegal = this.localidades.find(item => item._id === this.profesional.domicilios[1].ubicacion.localidad._id);
                this.editarDomReal = false;
                this.editarDomLegal = true;
                this.editarDomProfesional = false;
            } else {
                this.localidadProfesional = this.localidades.find(item => item._id === this.profesional.domicilios[2].ubicacion.localidad._id);
                this.editarDomReal = false;
                this.editarDomLegal = false;
                this.editarDomProfesional = true;
            }
        });
    }

    editarDomicilio(tipo) {
        if (tipo === 'real') {
            this.direccionReal = this.profesional.domicilios[0].valor;
            this.codigoPostalReal = this.profesional.domicilios[0].codigoPostal;
            this.loadProvincias('real');
        } else if (tipo === 'legal') {
            this.direccionLegal = this.profesional.domicilios[1].valor;
            this.codigoPostalLegal = this.profesional.domicilios[1].codigoPostal;
            this.loadProvincias('legal');
        } else {
            this.direccionProfesional = this.profesional.domicilios[2].valor;
            this.codigoPostalProfesional = this.profesional.domicilios[2].codigoPostal;
            this.loadProvincias('profesional');
        }

    }

    guardarDomicilio(tipo) {
        if (tipo === 'real') {
            if (this.direccionReal !== "" && this.codigoPostalReal !== "" && this.localidadReal && this.provinciaReal) {
                this.editarDomReal = false;
                this.profesional.domicilios[0].valor = this.direccionReal;
                this.profesional.domicilios[0].codigoPostal = this.codigoPostalReal
                this.profesional.domicilios[0].ubicacion.provincia = this.provinciaReal;
                this.profesional.domicilios[0].ubicacion.localidad = this.localidadReal;
            } else {
                this.toast.danger('Falta completar datos del domicilio real');
            }
        } else if (tipo === 'legal') {
            if (this.direccionLegal !== "" && this.codigoPostalLegal !== "" && this.localidadLegal && this.provinciaLegal) {
                this.editarDomLegal = false;
                this.profesional.domicilios[1].valor = this.direccionLegal;
                this.profesional.domicilios[1].codigoPostal = this.codigoPostalLegal;
                this.profesional.domicilios[1].ubicacion.provincia = this.provinciaLegal;
                this.profesional.domicilios[1].ubicacion.localidad = this.localidadLegal;
            } else {
                this.toast.danger('Falta completar datos del domicilio legal');
            }
        } else {
            if (this.direccionProfesional !== "" && this.codigoPostalProfesional !== "" && this.localidadProfesional && this.provinciaProfesional) {
                this.editarDomProfesional = false;
                this.profesional.domicilios[2].valor = this.direccionProfesional;
                this.profesional.domicilios[2].codigoPostal = this.codigoPostalProfesional;
                this.profesional.domicilios[2].ubicacion.provincia = this.provinciaProfesional;
                this.profesional.domicilios[2].ubicacion.localidad = this.localidadProfesional;
            } else {
                this.toast.danger('Falta completar datos del domicilio profesional');
            }
        }
    }

    cancelarEditar(tipo) {
        if (tipo === 'real') {
            this.editarDomReal = false;
            this.direccionReal = null;
            this.codigoPostalReal = null;
            this.localidadReal = null;
            this.provinciaReal = null;
        } else if (tipo === 'legal') {
            this.editarDomLegal = false;
            this.direccionLegal = null;
            this.codigoPostalLegal = null;
            this.localidadLegal = null;
            this.provinciaLegal = null;
        } else {
            this.editarDomProfesional = false;
            this.direccionProfesional = null;
            this.codigoPostalProfesional = null;
            this.localidadProfesional = null;
            this.provinciaProfesional = null;
        }
    }
}




