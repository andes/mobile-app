import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TurnosProvider } from '../../../../providers/turnos';
import { AuthProvider } from '../../../../providers/auth/auth';
import * as moment from 'moment/moment';
import { ErrorReporterProvider } from '../../../../providers/library-services/errorReporter';
import { StorageService } from 'src/providers/storage-provider.service';

interface Turno {
    prestacion: string;
    organizacion: string;
    profesionales: string;
    textoBadge: string;
    claseBadge: string;
    horaAsistencia?: string;
    horaInicio?: string;
    paciente?: any;
    estadoTurno?: string;
}
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
        private storage: StorageService,
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
        this.turnosProvider.getHistorial({ pacienteId }).subscribe((turnos: any[]) => {

            this.sortTurnos(turnos);

            this.ultimosTurnos = turnos
                .filter(t => moment(t.horaInicio).isSameOrBefore(new Date(), 'day'))
                .map(t => this.transformarTurno(t));
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
        this.router.navigate(['/turnos/notificaciones-turnos'], {
            queryParams: {
                turno: JSON.stringify(turno),
                organizacion: JSON.stringify(turno.organizacion),
                action: 'turno-historial'
            }
        });
    }

    onBugReport() {
        this.reporter.report();
    }
    private transformarTurno(turno: any): Turno {
        let textoBadge = '';
        let claseBadge = '';

        if (turno.asistencia === 'noAsistio') {
            textoBadge = 'no asistió al turno';
            claseBadge = 'danger';
        } else if (turno.asistencia === 'asistio') {
            textoBadge = `asistencia a las ${new Date(turno.horaAsistencia).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs.`;
            claseBadge = 'success';
        } else if (turno.estado === 'suspendido') {
            textoBadge = 'turno suspendido';
            claseBadge = 'warning';
        } else {
            textoBadge = 'sin datos de asistencia';
            claseBadge = 'light-gris';
        }

        return {
            prestacion: turno.tipoPrestacion?.term || 'Sin prestación',
            organizacion: turno.organizacion || 'Sin organización',
            profesionales: turno.profesionales?.length
                ? turno.profesionales.map((p: any) => `${p.apellido}, ${p.nombre}`).join(', ')
                : 'Sin profesional asignado',
            textoBadge,
            claseBadge,
            horaAsistencia: turno.horaAsistencia,
            horaInicio: turno.horaInicio,
            paciente: {
                nombre: turno.paciente?.nombre || '',
                apellido: turno.paciente?.apellido || '',
            },
            estadoTurno: turno.estado || turno.asistencia || ''
        };
    }
}
