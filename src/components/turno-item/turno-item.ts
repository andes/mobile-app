import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as moment from 'moment/moment';
// providers
import { TurnosProvider } from '../../providers/turnos';
import { ToastProvider } from '../../providers/toast';

@Component({
    selector: 'app-turno-item',
    templateUrl: 'turno-item.html',
})

export class TurnoItemComponent implements OnInit {
    @Input() turno: any;
    onCancelEvent: EventEmitter<any> = new EventEmitter();
    @Output() clickEvent: EventEmitter<any> = new EventEmitter();


    private expand = false;
    constructor(
        private toast: ToastProvider,
        private turnosProvider: TurnosProvider) {
    }

    ngOnInit() {
        if (this.turno.reasignado_anterior) {
            this.turno.reasignado_anterior.fecha = moment(this.turno.reasignado_anterior.horaInicio);
        }
    }

    profesionalName() {
        if (this.turno.profesionales.length > 0) {
            return this.turno.profesionales[0].apellido + ' ' + this.turno.profesionales[0].nombre;
        } else {
            return 'Sin profesional';
        }
    }

    turnoFecha() {
        return moment(this.turno.horaInicio).format('DD [de] MMMM');
    }

    turnoHora() {
        return moment(this.turno.horaInicio).format('HH:mm');
    }

    turnoConfirmado() {
        if (this.turno.confirmedAt != null) {
            return 'Confirmado';
        }
    }

    tootleExpand() {
        this.expand = !this.expand;
    }

    isToday() {
        return moment(new Date()).format('DD/MM/YYYY') === moment(this.turno.horaInicio).format('DD/MM/YYYY');
    }

    isSuspendido() {
        return this.turno.estado === 'suspendido' || this.turno.agenda_estado === 'suspendida';
    }

    isReasignado() {
        return this.turno.reasignado;
    }

    turnoConfirmadoAsistencia() {
        return this.turno.asistencia && this.turno.asistencia === 'asistio';
    }

    // onCancel($event) {
    //     this.showConfirm('¿Desea cancelar el turno selecionado?', '').then(() => {
    //         const params = {
    //             turno_id: this.turno._id,
    //             agenda_id: this.turno.agenda_id,
    //             bloque_id: this.turno.bloque_id
    //         };
    //         this.turnosProvider.cancelarTurno(params).then(() => {
    //             this.cancelEvent.emit(this.turno);
    //         });
    //     }).catch(() => { });

    // }

    onTurnoClick() {
        this.clickEvent.emit(this.turno);
    }

    onConfirm() {
        const params = {
            turno_id: this.turno._id,
            agenda_id: this.turno.agenda_id,
            bloque_id: this.turno.bloque_id
        };
        this.turnosProvider.confirmarTurno(params).then(() => {
            this.turno.confirmedAt = new Date();
            this.toast.success('Turno confirmado con exito!');
        }).catch(() => {
            this.toast.danger('No se pudo confirmar el turno. Vuelva a intentar.');
        });
    }

    // async showConfirm(title, message) {
    //     const confirm = await this.alertCtrl.create({
    //         header: title,
    //         message,
    //         buttons: [
    //             {
    //                 text: 'Cancelar',
    //                 handler: () => {
    //                     reject();
    //                 }
    //             },
    //             {
    //                 text: 'Aceptar',
    //                 handler: () => {
    //                     resolve();
    //                 }
    //             }
    //         ]
    //     });
    //     await confirm.present();

    // }

    onConfirmAsistencia() {
        const params = {
            turno_id: this.turno._id,
            agenda_id: this.turno.agenda_id,
            bloque_id: this.turno.bloque_id
        };
        this.turnosProvider.confirmarAsistenciaTurno(params).then(() => {
            this.turno.asistencia = 'asistio';
            this.toast.success('Asistencia al turno confirmada con exito!');
        }).catch(() => {
            this.toast.danger('No se pudo confirmar la asistencia del turno. Vuelva a intentar.');
        });
    }

    // async showConfirmAsistencia(title, message) {
    //     const confirm = await this.alertCtrl.create({
    //         header: title,
    //         message,
    //         buttons: [
    //             {
    //                 text: 'Cancelar',
    //                 handler: () => {
    //                     reject();
    //                 }
    //             },
    //             {
    //                 text: 'Aceptar',
    //                 handler: () => {
    //                     resolve();
    //                 }
    //             }
    //         ]
    //     });
    //     confirm.present();
    // }

    onMenuItemClick(action) {
        if (action === 'cancelar') {
            // this.onCancel(null);
        } else if (action === 'confirmar') {
            this.onConfirm();
        } else if (action === 'asistencia') {
            this.onConfirmAsistencia();
        }
    }

}
