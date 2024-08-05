import { Component, EventEmitter, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/providers/storage-provider.service';
import * as moment from 'moment/moment';
// providers
import { TurnosProvider } from '../../../../providers/turnos';
import { ToastProvider } from '../../../../providers/toast';
import { ProfesionalProvider } from '../../../../providers/profesional';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-turno-detalle',
    templateUrl: 'turno-detalle.html',
    styleUrls: ['turno-detalle.scss']
})
export class TurnosDetallePage implements OnInit {

    public turno: any;
    public turnoAsignado;
    public turnoActivo;
    familiar: any;
    profesional: any = null;
    cancelEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private turnosProvider: TurnosProvider,
        private toast: ToastProvider,
        private alertCtrl: AlertController,
        private storage: StorageService,
        private profesionalProvider: ProfesionalProvider
    ) {
    }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            this.route.queryParams.subscribe(params => {
                this.turno = params.turno;
                this.turno = JSON.parse(this.turno);
                this.turnoActivo = moment(this.turno.horaInicio).isAfter(moment());
                this.turnoAsignado = this.turno.estado === 'asignado' ? true : false;
            });
            const profesionalId = this.turno.profesionales[0]._id;
            this.profesionalProvider.getById(profesionalId).then((data: any) => {
                this.profesional = data[0];
            });
        });
    }

    profesionalName() {
        if (this.turno.profesionales.length > 0) {
            return this.turno.profesionales[0].apellido + ' ' + this.turno.profesionales[0].nombre;
        } else {
            return 'Sin profesional';
        }
    }

    profesionalFormacion() {

        if (this.profesional?.profesionalMatriculado && this.profesional.formacionGrado?.length > 0) {
            return this.profesional.formacionGrado[0].profesion.nombre;
        } else {
            return 'Sin especialidad';
        }

    }

    diaTurnoFecha() {
        return moment(this.turno.horaInicio).format('dddd');
    }
    turnoFecha() {
        return moment(this.turno.horaInicio).format('DD/MM/YY');
    }

    turnoHora() {
        return moment(this.turno.horaInicio).format('hh:mm A').replace('AM', 'a.m.').replace('PM', 'p.m.');
    }

    isAsignado() {
        return this.turno.estado === 'asignado' ? true : false;
    }

    cancelarTurno() {
        this.showConfirm('Cancelar', '¿Seguro desea cancelar este turno?').then(() => {
            const params = {
                turno_id: this.turno._id,
                agenda_id: this.turno.agenda_id,
                bloque_id: this.turno.bloque_id,
                familiar: this.familiar
            };
            this.turnosProvider.cancelarTurno(params).subscribe((resultado) => {
                this.cancelEvent.emit(this.turno);
                this.toast.success('El turno fue liberado correctamente');
                this.router.navigate(['/home/paciente']);

            }, (error) => {
                this.toast.danger('Ocurrió un error al cancelar el turno, reintente más tarde');
                this.router.navigate(['home/paciente']);
            });
        }).catch(() => { });
    }

    showConfirm(title, message) {
        return new Promise(async (resolve, reject) => {
            const confirm = await this.alertCtrl.create({
                header: title,
                message,
                buttons: [
                    {
                        text: 'Cancelar',
                        handler: () => {
                            reject();
                        }
                    },
                    {
                        text: 'Aceptar',
                        handler: () => {
                            resolve(true);
                        }
                    }
                ]
            });
            confirm.present();
        });
    }

    efector() {
        return this.turno.organizacion.nombre;
    }

    mapTurno() {
        const idOrganizacion = this.turno.organizacion._id;
        this.turnosProvider.getUbicacionTurno(idOrganizacion).subscribe((data: any) => {
            const centro: any = {
                nombre: data._doc.nombre,
                domicilio: {
                    direccion: data._doc.direccion.valor
                },
                location: {
                    latitud: data.coordenadasDeMapa.latitud,
                    longitud: data.coordenadasDeMapa.longitud
                }
            };
            this.router.navigate(['/turnos/mapa'], { queryParams: { centro: JSON.stringify(centro) } });
        });
    }

    linkConsultorioVirtual(link) {
        window.open(link);
    }

    get estadoTurno() {
        switch (this.turno.estado) {
            case 'suspendido':
                return 'danger';
            case 'asignado':
                return 'success';
            default:
                return 'info';
        }
    }
}
