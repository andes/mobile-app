import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { ActivatedRoute, Router } from '@angular/router';
// providers
import { ProfesionalProvider } from 'src/providers/profesional';
import { ToastProvider } from 'src/providers/toast';
import { IonContent } from '@ionic/angular';

@Component({
    selector: 'app-datos-profesional',
    templateUrl: 'datos-profesional.html',
    styleUrls: ['datos-profesional.scss'],
})

export class DatosProfesionalPage implements OnInit, AfterViewInit {
    @ViewChild(IonContent, { static: false }) content: IonContent;

    inProgress = true;
    datos: any;
    profesional: any;
    validado = false;
    domicilioReal: any;
    domicilioLegal;
    domicilioProfesional: any;
    provincias: any[] = [];
    localidades: any[] = [];
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

            if (this.authProvider.user.documento !== this.datos.documento) {
                this.toast.danger('El documento escaneado no se corresponde con la cuenta de usuario.');
                this.inProgress = false;
                this.route.navigate(['profesional/scan-profesional']);
                return;
            }
            const profesionalId = this.authProvider.user.profesionalId;

            this.profesionalProvider.validarProfesional({
                documento: this.datos.documento, sexo: this.datos.sexo.toLowerCase(),
                nombre: this.datos.nombre, apellido: this.datos.apellido,
                fechaNacimiento: this.datos.fechaNacimiento
            }).then((data: any) => {
                if (data.profesional) {
                    this.profesional = data.profesional;

                    this.profesional.domicilios.forEach(dom => {
                        // Para evitar errores en la edicion ..
                        dom.valor = dom.valor === null ? '' : dom.valor;
                        dom.codigoPostal = dom.codigoPostal === null ? '' : dom.codigoPostal;
                        if (data.profesional.id === profesionalId) {
                            this.domicilioReal = this.profesional.domicilios?.find(d => d.tipo === 'real');
                            this.domicilioLegal = this.profesional.domicilios?.find(d => d.tipo === 'legal');
                            this.domicilioProfesional = this.profesional.domicilios?.find(d => d.tipo === 'profesional');
                            this.inProgress = false;
                            this.validado = true;
                        }
                    });
                }
            }, error => {
                this.route.navigate(['profesional/scan-profesional']);
                this.toast.danger('Sus datos no pudieron ser validados');
            });
        });
    }

    ngAfterViewInit() {
        this.profesionalProvider.getProvincias().then((data: any) => this.provincias = data);
    }

    confirmarDatos() {
        const domicilioReal = this.profesional.domicilios.find(dom => dom.tipo === 'real');
        if (!domicilioReal.valor || !domicilioReal.ubicacion.provincia?._id || !domicilioReal.ubicacion.localidad?._id) {
            // si falta algun dato del domicilio real (se asume que el legal siempre viene completo. El profesional no es requerido)
            this.toast.danger('Datos faltantes en su domicilio REAL');
            return;
        }
        const profesionalUpdate = {
            domicilios: this.profesional.domicilios,
            idProfesional: this.profesional.id
        };
        this.profesionalProvider.updateProfesional(profesionalUpdate.idProfesional, { domiciliosMobile: profesionalUpdate }).then(() => {
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
        }
        if (tipo === 'profesional') {
            this.localidadProfesional = null;
            this.codigoPostalProfesional = null;

            const provincia = this.provincias.find(p => p.nombre === this.provinciaProfesional.trim());
            this.provinciaProfesional = provincia;
            this.loadLocalidades(provincia, 'profesional');
        }
    }

    onSelectLocalidad(tipo) {
        if (this.localidadReal?._id || this.localidadProfesional?._id) {
            if (tipo === 'real') {
                this.codigoPostalReal = this.localidades.find(item => item._id === this.localidadReal._id).codigoPostal || '';
            } else {
                this.codigoPostalProfesional = this.localidades.find(item => item._id === this.localidadProfesional._id).codigoPostal || '';
            }
        } else {
            this.codigoPostalReal = '';
            this.codigoPostalProfesional = '';
        }
    }

    loadLocalidades(provincia, tipo) {
        if (!provincia._id) {
            if (tipo === 'real') {
                this.localidadReal = { _id: null, nombre: '' };
                this.editarDomReal = true;
                this.editarDomProfesional = false;
            }
            if (tipo === 'profesional') { // profesional
                this.localidadProfesional = { _id: null, nombre: '' };
                this.editarDomReal = false;
                this.editarDomProfesional = true;

            }
            return;
        }
        const index = this.profesional.domicilios.findIndex(dom => dom.tipo === tipo);
        const idLocalidad = this.profesional.domicilios[index].ubicacion.localidad?._id;

        this.profesionalProvider.getLocalidades(provincia._id).then((data: any) => {
            this.localidades = data;
            const localidad = this.localidades.find(item => item._id === idLocalidad);

            // setea variables para vista de edicion de domicilio
            if (tipo === 'real') {
                this.localidadReal = Object.assign({}, localidad);
                this.editarDomReal = true;
                this.editarDomProfesional = false;
            }
            if (tipo === 'profesional') { // profesional
                this.localidadProfesional = Object.assign({}, localidad);
                this.editarDomReal = false;
                this.editarDomProfesional = true;
            }
            setTimeout(() => {
                this.content.scrollToBottom(500);
            }, 200);
        });
    }

    editarDomicilio(tipo) {
        const index = this.profesional.domicilios.findIndex(dom => dom.tipo === tipo);
        const idProvincia = this.profesional.domicilios[index].ubicacion.provincia?._id;
        const provincia = this.provincias.find(item => item._id === idProvincia) || { _id: null, nombre: '' };

        if (tipo === 'real') {
            this.direccionReal = this.profesional.domicilios[index].valor;
            this.codigoPostalReal = this.profesional.domicilios[index].codigoPostal;
            this.provinciaReal = Object.assign({}, provincia);
        } else { // profesional
            this.direccionProfesional = this.profesional.domicilios[index].valor;
            this.codigoPostalProfesional = this.profesional.domicilios[index].codigoPostal;
            this.provinciaProfesional = Object.assign({}, provincia);
        }
        this.loadLocalidades(provincia, tipo);
    }

    guardarDomicilio(tipo) {
        const index = this.profesional.domicilios.findIndex(dom => dom.tipo === tipo);
        if (tipo === 'real') {
            if (this.direccionReal !== '' && this.codigoPostalReal !== ''
                && this.localidadReal && this.provinciaReal) {
                this.editarDomReal = false;
                this.profesional.domicilios[index].valor = this.direccionReal;
                this.profesional.domicilios[index].codigoPostal = this.codigoPostalReal;
                this.profesional.domicilios[index].ubicacion.provincia = this.provinciaReal;
                this.profesional.domicilios[index].ubicacion.localidad = this.localidadReal;
            } else {
                this.toast.danger('Falta completar datos del domicilio real');
            }
        } else { // profesional
            if (this.direccionProfesional !== '' && this.codigoPostalProfesional !== '' &&
                this.localidadProfesional && this.provinciaProfesional) {
                this.editarDomProfesional = false;
                this.profesional.domicilios[index].valor = this.direccionProfesional;
                this.profesional.domicilios[index].codigoPostal = this.codigoPostalProfesional;
                this.profesional.domicilios[index].ubicacion.provincia = this.provinciaProfesional;
                this.profesional.domicilios[index].ubicacion.localidad = this.localidadProfesional;
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
        } else { // profesional
            this.editarDomProfesional = false;
            this.direccionProfesional = null;
            this.codigoPostalProfesional = null;
            this.localidadProfesional = null;
            this.provinciaProfesional = null;
        }
    }
}
