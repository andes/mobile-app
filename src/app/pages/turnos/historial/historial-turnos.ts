import { Component, OnInit } from '@angular/core';
import { TurnosProvider } from '../../../../providers/turnos';
import { AuthProvider } from '../../../../providers/auth/auth';
import * as moment from 'moment/moment';
import { ErrorReporterProvider } from '../../../../providers/errorReporter';
import { Storage } from '@ionic/storage';


@Component({
    selector: 'app-historial-turnos',
    templateUrl: 'historial-turnos.html',
})
export class HistorialTurnosPage implements OnInit{

    turnosPaciente: any;
    ultimosTurnos: any;
    constructor(
        public turnosProvider: TurnosProvider,
        public authProvider: AuthProvider,
        public reporter: ErrorReporterProvider,
        public storage: Storage,
    ) {

    }

    ngOnInit() {
        this.getHistorial();
    }

    getHistorial() {
        let pacienteId;
        this.storage.get('familiar').then((value) => {
            if (value) {
                pacienteId = value.id;
            } else {
                pacienteId = this.authProvider.user.pacientes[0].id;
            }
            this.turnosProvider.getHistorial({ pacienteId, sinLiberados: true }).then((turnos: any[]) => {
                this.sortTurnos(turnos);
                const turnosFiltrados = turnos.filter(t => {
                    return moment(t.horaInicio).isSameOrBefore(new Date(), 'day');
                });
                // Agrego la propiedad asisistencia
                turnosFiltrados.forEach(element => {
                    if (!element.asistencia) {
                        if (element.motivoSuspension) {
                            element.asistencia = 'suspendido';
                        } else {
                            element.asistencia = 'sin datos';
                        }
                    }
                })
                this.ultimosTurnos = turnosFiltrados;
            });
        });
    }

    private sortTurnos(turnos) {
        turnos = turnos.sort((a, b) => {
            const inia = a.horaInicio ? new Date(a.horaInicio) : null;
            const inib = b.horaInicio ? new Date(b.horaInicio) : null;
            {
                return ((inia && inib) ? (inib.getTime() - inia.getTime()) : 0);
            }

        });
    }

    onBugReport() {
        this.reporter.report();
    }
}
