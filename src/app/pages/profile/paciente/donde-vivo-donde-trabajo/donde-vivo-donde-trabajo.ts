import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PacienteProvider } from 'src/providers/paciente';
import { ToastProvider } from 'src/providers/toast';
import { AuthProvider } from 'src/providers/auth/auth';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-page-donde-vivo-trabajo',
    templateUrl: 'donde-vivo-donde-trabajo.html',
})
export class DondeVivoDondeTrabajoPage implements OnInit {

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

    public direccion = '';
    public localidad = '';
    public provincia = '';
    public inProgress = false;
    public paciente: any;
    private ranking: number;
    public familiar: any = false;

    constructor(
        private toast: ToastProvider,
        private pacienteProvider: PacienteProvider,
        private authService: AuthProvider,
        private storage: Storage
    ) {
    }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            let pacienteId;
            if (value) {
                pacienteId = value.id;
                this.familiar = true;
            } else {
                if (this.authService.user.pacientes && this.authService.user.pacientes[0]) {
                    pacienteId = this.authService.user.pacientes[0].id;
                }
            }
            this.pacienteProvider.get(pacienteId).then((paciente: any) => {
                this.paciente = paciente;
                this.ranking = 0;
                if (Array.isArray(this.paciente.direccion) && this.paciente.direccion.length) {
                    const dir = this.paciente.direccion[0];
                    if (dir.ubicacion.localidad) {
                        this.localidad = dir.ubicacion.localidad.nombre;
                    }
                    if (dir.ubicacion.provincia) {
                        this.provincia = dir.ubicacion.provincia.nombre;
                    }
                    if (dir) {
                        this.direccion = dir.valor;
                    }
                }
            });
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

        }
    }
}
