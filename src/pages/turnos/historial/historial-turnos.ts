import { Component } from '@angular/core';
import { TurnosProvider } from '../../../providers/turnos'
import { AuthProvider } from '../../../providers/auth/auth';
import moment from 'moment';
import { ErrorReporterProvider } from '../../../providers/errorReporter';


@Component({
    selector: 'page-historial-turnos',
    templateUrl: 'historial-turnos.html',
})
export class HistorialTurnosPage {

    turnosPaciente: any;
    ultimosTurnos: any;
    constructor(
        public turnosProvider: TurnosProvider,
        public authProvider: AuthProvider,
        public reporter: ErrorReporterProvider,
    ) {

    }

    ionViewDidLoad() {
        this.getHistorial();
    }

    getHistorial() {
        let pacienteId = this.authProvider.user.pacientes[0].id;
        this.turnosProvider.getHistorial({ pacienteId: pacienteId, sinLiberados: true }).then((turnos: any[]) => {
            this.sortTurnos(turnos);
            let turnosFiltrados = turnos.filter(t => {
                return moment(t.horaInicio).isSameOrBefore(new Date(), 'day');
            });
            // Agrego la propiedad asisistencia
            turnosFiltrados[0].forEach(element => {
                if (!element.asistencia) {
                    if (element.motivoSuspension) {
                        element.asistencia = 'suspendido';
                    } else {
                        element.asistencia = 'sin datos';
                    }
                }
            })
            this.ultimosTurnos = turnosFiltrados[0];
        });
    }

    private sortTurnos(turnos) {
        turnos = turnos.sort((a, b) => {
            let inia = a.horaInicio ? new Date(a.horaInicio) : null;
            let inib = b.horaInicio ? new Date(b.horaInicio) : null;
            {
                return ((inia && inib) ? (inib.getTime() - inia.getTime()) : 0);
            }

        });
    }

    onBugReport() {
        this.reporter.report();
    }
}
