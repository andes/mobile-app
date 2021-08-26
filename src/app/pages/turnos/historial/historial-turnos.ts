import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TurnosProvider } from '../../../../providers/turnos';
import { AuthProvider } from '../../../../providers/auth/auth';
import * as moment from 'moment/moment';
import { ErrorReporterProvider } from '../../../../providers/errorReporter';
import { StorageService } from 'src/providers/storage-provider.service';

@Component({
    selector: 'app-historial-turnos',
    templateUrl: 'historial-turnos.html',
})

export class HistorialTurnosPage implements OnInit {

    turnosPaciente: any;
    ultimosTurnos: any;
    familiar: any;
    loading = true;

    constructor(
        private turnosProvider: TurnosProvider,
        private authProvider: AuthProvider,
        private reporter: ErrorReporterProvider,
        private storage: Storage,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            this.getHistorial();
        });
    }

    getHistorial() {
        let pacienteId;
        if (this.familiar) {
            pacienteId = this.familiar.id;
        } else {
            pacienteId = this.authProvider.user.pacientes[0].id;
        }
        this.turnosProvider.getHistorial({ pacienteId, sinLiberados: true }).subscribe((turnos: any[]) => {
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
            });
            this.ultimosTurnos = turnosFiltrados;
            this.loading = false;
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


    verDetalle(turno) {
        this.router.navigate(['/turnos/notificaciones-turnos', { turno: JSON.stringify(turno) }]);
    }

    onBugReport() {
        this.reporter.report();
    }
}
