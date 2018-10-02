import { Component, Input, EventEmitter } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { AgendasProvider } from '../../../providers/agendas';
import { TurnosProvider } from '../../../providers/turnos';
import { ToastProvider } from '../../../providers/toast';
import { AuthProvider } from '../../../providers/auth/auth';
import { PacienteProvider } from '../../../providers/paciente';

// page
import { HomePage } from '../../home/home';

@Component({
    selector: 'page-turnos-calendario',
    templateUrl: 'turnos-calendario.html'
})

export class TurnosCalendarioPage {
    private onResumeSubscription: Subscription;
    private efector: any;
    private agendas: any;
    private turnoToShow = null;
    private showConfirmationSplash = false;
    constructor(
        public navCtrl: NavController,
        public turnosProvider: TurnosProvider,
        public agendasProvider: AgendasProvider,
        public navParams: NavParams,
        public authService: AuthProvider,
        public pacienteProvider: PacienteProvider,
        private toast: ToastProvider,
        public alertCtrl: AlertController,
        public platform: Platform) {

        this.efector = this.navParams.get('efector');
        this.agendas = this.filtrarCantidadTurnos(this.efector.agendas);
    }

    filtrarCantidadTurnos(agendas) {
        // Sólo muestro 4 turnos disponibles por efector
        // CONSULTAR SI SIEMPER MUESTRO 4 DISPONIBLES O SE DEBE CONTROLAR LOS YA ASIGNADOS POR APP MOBILE
        let lasAgendas = agendas;
        lasAgendas.forEach(ag => {
            ag.bloques.forEach(bloque => {
                if (bloque.turnos.length > 4) {
                    bloque.turnos = bloque.turnos.splice(-4);
                }
            });
        });
        return lasAgendas
    }

    mostrarEfector(agenda) {
        return agenda.organizacion
    }

    mostrarProfesionales(profesionales) {
        return (profesionales[0].apellido + ' ' + profesionales[0].nombre);
    }

    disponible(turno) {
        return turno.estado === 'disponible';
    }

    confirmar(agenda, turno) {
        let pacienteId = this.authService.user.pacientes[0].id;
        let prestacion = agenda.bloques[0].tipoPrestaciones[0];

        this.pacienteProvider.get(pacienteId).then((paciente: any) => {
            let pacienteSave = {
                id: paciente.id,
                documento: paciente.documento,
                apellido: paciente.apellido,
                nombre: paciente.nombre,
                alias: paciente.alias,
                fechaNacimiento: paciente.fechaNacimiento,
                sexo: paciente.sexo,
                telefono: paciente.contacto,
                carpetaEfectores: paciente.carpetaEfectores
            };
            // Datos del Turno
            let datosTurno = {
                idAgenda: agenda._id,
                idTurno: turno._id,
                idBloque: agenda.bloques[0]._id,
                paciente: pacienteSave,
                tipoPrestacion: prestacion,
                tipoTurno: 'programado',
                emitidoPor: 'appMobile',
                nota: 'Turno pedido desde app móvil',
                motivoConsulta: ''
            };
            this.agendasProvider.save(datosTurno, { showError: false }).then(resultado => {
                this.toast.success('Turno asignado correctamente', 700, () => {
                    this.navCtrl.push(HomePage);
                });
            }).catch(() => {
                this.toast.danger('Error asignando el turno, intente nuevamente');
            });
        }).catch((err) => {
            this.toast.danger('Error en la confirmación del turno, intente nuevamente');
        });
    }

    cancelar(agenda) {
        // refrescar las agendas nuevamente: TERMINAR!!!
        // this.agendasProvider.getById(agenda._id).then(agendaRefresh => {
        //     debugger;
        //     let indice = this.agendas.indexOf(agenda._id);
        //     if (indice !== -1) {
        //         this.agendas.splice(indice, 1);
        //     }
        //     this.agendas.push(agendaRefresh);
        // });
        this.showConfirmationSplash = false;
    }

    confirmationSplash(agenda, turno) {
        this.turnoToShow = {
            fecha: turno.horaInicio,
            prestacion: agenda.tipoPrestaciones[0].term,
            profesional: this.mostrarProfesionales(agenda.profesionales),
            efector: agenda.organizacion.nombre,
            nota: 'Si no puede concurrir al turno, le solicitamos cancelarlo desde la aplicación o bien comunicandose con el centro de salud. Muchas gracias',
            a: agenda,
            t: turno
        };
        this.showConfirmationSplash = true;
    }
}





