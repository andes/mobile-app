import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PacienteProvider } from 'src/providers/paciente';
import { ToastProvider } from 'src/providers/toast';
import { AuthProvider } from 'src/providers/auth/auth';
import { StorageService } from 'src/providers/storage-provider.service';
import { ProfesionalProvider } from 'src/providers/profesional';
import { AlertController, IonContent } from '@ionic/angular';

@Component({
    selector: 'app-page-donde-vivo-trabajo',
    templateUrl: 'donde-vivo-donde-trabajo.html',
})
export class DondeVivoDondeTrabajoPage implements OnInit {

    @ViewChild(IonContent, { static: false }) content: IonContent;
    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

    public direccion = '';
    public localidad: any;
    public provincia: any;
    public inProgress = false;
    public paciente: any;
    private ranking: number;
    public familiar: any = false;

    provincias: any[] = [];
    localidades: any[] = [];
    localidadesLoaded = false;
    localidadReal: any;
    codigoPostalReal: any;
    provinciaReal: any;
    editarDomReal: boolean;
    editarDomProfesional: boolean;

    constructor(
        private toast: ToastProvider,
        private pacienteProvider: PacienteProvider,
        private authService: AuthProvider,
        private storage: StorageService,
        private profesionalProvider: ProfesionalProvider,
        public alertController: AlertController,
    ) {
    }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            let pacienteId;
            if (value) {
                pacienteId = value.id;
                this.familiar = true;
            } else {
                if (this.authService.user?.pacientes && this.authService.user.pacientes[0]) {
                    pacienteId = this.authService.user.pacientes[0].id;
                }
            }
            this.pacienteProvider.get(pacienteId).then((paciente: any) => {
                this.paciente = paciente;
                this.ranking = 0;
                if (Array.isArray(this.paciente.direccion) && this.paciente.direccion.length) {
                    const dir = this.paciente.direccion[0];
                    if (dir.ubicacion.localidad) {
                        this.localidad = dir.ubicacion.localidad;
                    }
                    if (dir.ubicacion.provincia) {
                        this.provincia = dir.ubicacion.provincia;
                    }
                    if (dir) {
                        this.direccion = dir.valor;
                    }
                }
            });
        });
        this.profesionalProvider.getProvincias().then((data: any) => this.provincias = data);
    }

    onSelectLocalidad() {
        this.loadLocalidades(this.provincia);
    }
    onSelectProvincia(tipo) {
        if (tipo === 'real') {
            this.localidad = null;
            this.loadLocalidades(this.provincia);
        }
    }

    loadLocalidades(provincia) {

        if (!this.localidadesLoaded || !this.localidad) {
            const idLocalidad = this.paciente?.direccion[0].ubicacion?.localidad?._id;


            this.profesionalProvider.getLocalidades(provincia._id).then((data: any) => {
                this.localidades = data;
                const localidad = this.localidades.find(item => item._id === idLocalidad);

                // setea variables para vista de edicion de domicilio
                if (localidad) {
                    this.localidad = Object.assign({}, localidad);
                }
                setTimeout(() => {
                    this.content.scrollToBottom(500);
                }, 200);
            });
            this.localidadesLoaded = true;
        }
    }

    public async modal() {
        const confirm = await this.alertController.create({
            header: 'Actualizar Domicilio',
            message: '¿Está seguro que desea actualizar sus datos en el sistema de salud?',
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        // resolve();
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        this.onSave();
                    }
                }
            ]
        });
        await confirm.present();
    }

    onSave() {
        if (this.direccion && this.provincia && this.localidad) {
            const direccion = {
                ranking: this.ranking,
                valor: this.direccion,
                codigoPostal: '0',
                ubicacion: {
                    localidad: this.localidad,
                    provincia: this.provincia,
                    pais: {
                        nombre: 'Argentina'
                    }
                }
            };
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
                this.toast.success('Datos de ubicación actualizados.');
                // this.navCtrl.pop();
            }).catch(() => {
                this.inProgress = false;
                this.toast.danger('Hubo un problema al actualizar los datos.');
            });
        } else {
            this.toast.danger('Datos faltantes en su domicilio.');
        }
    }
}
