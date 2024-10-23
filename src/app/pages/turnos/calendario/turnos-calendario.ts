import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/providers/storage-provider.service';
// providers
import { AgendasProvider } from 'src/providers/agendas';
import { TurnosProvider } from 'src/providers/turnos';
import { ToastProvider } from 'src/providers/toast';
import { AuthProvider } from 'src/providers/auth/auth';
import { PacienteProvider } from 'src/providers/paciente';
import { ErrorReporterProvider } from 'src/providers/library-services/errorReporter';
import { Router } from '@angular/router';

@Component({
    selector: 'app-turnos-calendario',
    templateUrl: 'turnos-calendario.html'
})

export class TurnosCalendarioPage implements OnInit {
    public efector: any;
    private prestacion: any;
    user: any;
    familiar = false;
    telefono = '';
    pacienteSave: any;
    editarPhone = false;

    public agendas: any;
    public confirmado = false;
    public turnoToShow = null;
    public showConfirmationSplash = false;
    constructor(
        private turnosProvider: TurnosProvider,
        private agendasProvider: AgendasProvider,
        private authService: AuthProvider,
        private pacienteProvider: PacienteProvider,
        private toast: ToastProvider,
        private reporter: ErrorReporterProvider,
        private storage: StorageService,
        private router: Router
    ) {
    }

    ngOnInit() {

        this.storage.get('familiar').then((value) => {
            let pacienteId = null;
            if (value) {
                pacienteId = value.id;
                this.familiar = true;
            } else {
                if (this.authService.user.pacientes && this.authService.user.pacientes[0]) {
                    pacienteId = this.authService.user.pacientes[0].id;
                }
            }
            this.pacienteProvider.get(pacienteId).then((paciente: any) => {
                const phoneData = paciente.contacto.find(item => item.tipo === 'celular');
                if (phoneData) {
                    this.telefono = phoneData.valor;
                }

            });
        });
    }

    ionViewDidEnter() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.user = value;
                this.familiar = true;
            } else {
                this.user = this.authService.user.pacientes[0];
            }
        });
        this.storage.get('calendario').then((calendario: any) => {
            this.prestacion = calendario.prestacion;
            this.efector = calendario.efector;
            this.agendas = this.efector.agendas.filter((agenda: any) => {
                return agenda.tipoPrestaciones.some(item => item._id === calendario.prestacion._id);
            });
            this.refreshAgendas();
        });

    }

    agruparTurnosPorSegmento(turnos) {
        const turnosGrouped: any = [];
        turnos.forEach(turno => {
            if (!this.findObjectByKey(turnosGrouped, 'horaInicio', turno.horaInicio) && turno.estado === 'disponible') {
                turnosGrouped.push(turno);
            }
        });
        return turnosGrouped;
    }

    mostrarEfector(agenda) {
        return agenda.organizacion;
    }

    mostrarProfesionales(profesionales) {
        if (profesionales.length > 0) {
            return (profesionales[0].apellido + ' ' + profesionales[0].nombre);
        } else {
            return 'Sin profesional';
        }
    }

    disponible(turno) {
        return turno.estado === 'disponible';
    }

    confirmar(agenda, bloque, turno) {
        this.confirmado = true;
        const prestacion = this.prestacion;
        const pacienteId = this.user.id;
        this.pacienteProvider.get(pacienteId).then(async (paciente: any) => {

            // Datos del paciente
            this.pacienteSave = {
                id: paciente.id,
                documento: paciente.documento,
                apellido: paciente.apellido,
                nombre: paciente.nombre,
                alias: paciente.alias,
                fechaNacimiento: paciente.fechaNacimiento,
                sexo: paciente.sexo,
                telefono: this.telefono,
                carpetaEfectores: paciente.carpetaEfectores
            };
            // Datos del Turno
            const datosTurno = {
                idAgenda: agenda._id,
                idTurno: turno._id,
                idBloque: bloque._id,
                link: agenda.link,
                paciente: this.pacienteSave,
                tipoPrestacion: prestacion,
                tipoTurno: 'programado',
                emitidoPor: 'appMobile',
                nota: 'Turno pedido desde app móvil',
                motivoConsulta: ''
            };

            this.agendasProvider.save(datosTurno, { showError: false }).subscribe(() => {
                this.toast.success('Turno asignado correctamente');
                this.router.navigate(['/home/paciente']);

            }, (error) => {
                if (error.message === 'La agenda ya no está disponible') {
                    this.toast.danger(error.message, 800);
                    this.confirmado = false;
                    // this.navCtrl.push(TurnosPage);
                } else {
                    this.toast.danger('El turno ya no está disponible, seleccione otro turno.', 800);
                    this.refreshAgendas();
                    this.confirmado = false;
                }
            });
        }).catch((err) => {
            this.toast.danger('Error en la confirmación del turno, intente nuevamente');
            this.confirmado = false;
        });
    }

    verificarTelefono() {
        const RegEx_Mobile = /^[1-9]{3}[0-9]{6,7}$/;
        const RegEx_Numero = /^(\d)+$/;
        return (RegEx_Mobile.test(this.telefono) && RegEx_Numero.test(this.telefono));
    }

    editarTelefono() {
        if (!this.editarPhone) {
            this.editarPhone = true;
            this.confirmado = true;
        } else {
            this.editarPhone = false;
            this.confirmado = false;
        }
    }

    cancelar() {
        this.refreshAgendas();
    }

    refreshAgendas() {
        this.agendas.sort((agendaA, agendaB) => {
            return new Date(agendaA.horaInicio).getTime() - new Date(agendaB.horaInicio).getTime();
        });
        this.agendas.forEach(agenda => {
            this.agendasProvider.getById(agenda._id).subscribe((agendaRefresh: any) => {
                const indice = this.agendas.indexOf(agenda);
                if (indice !== -1) {
                    this.agendas.splice(indice, 1);
                }
                agendaRefresh.cumpleRegla = agenda.cumpleRegla;

                this.agendas.splice(indice, 0, agendaRefresh);
                this.showConfirmationSplash = false;
            });
        });
    }

    confirmationSplash(agenda, bloque, turno) {
        this.turnoToShow = {
            fecha: turno.horaInicio,
            prestacion: this.prestacion.term,
            profesional: this.mostrarProfesionales(agenda.profesionales),
            efector: agenda.organizacion.nombre,
            nota: 'Si Ud. no puede concurrir al turno por favor recuerde cancelarlo a través de esta aplicación móvil, o comunicándose telefónicamente al Centro de Salud, para que otro paciente pueda tomarlo. ¡Muchas gracias!',
            a: agenda,
            b: bloque,
            t: turno
        };
        this.showConfirmationSplash = true;
    }

    turnosDisponibles(ag) {
        let hayDisponibles = false;
        ag.bloques.forEach(bloque => {
            bloque.turnos.forEach(turno => {
                if (turno.estado === 'disponible') {
                    return hayDisponibles = true;
                }
            });
        });
        return hayDisponibles;
    }

    findObjectByKey(array, key, value) {
        for (const item of array) {
            if (item[key] === value) {
                return item;
            }
        }
        return null;
    }

    onBugReport() {
        this.reporter.report();
    }

    incluyePrestacion(bloque) {
        const arr = bloque.tipoPrestaciones.find(item => item.conceptId === this.prestacion.conceptId);
        if (arr) {
            return true;
        } else {
            return false;
        }
    }

}
