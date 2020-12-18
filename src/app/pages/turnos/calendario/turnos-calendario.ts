import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';

// providers
import { AgendasProvider } from 'src/providers/agendas';
import { TurnosProvider } from 'src/providers/turnos';
import { ToastProvider } from 'src/providers/toast';
import { AuthProvider } from 'src/providers/auth/auth';
import { PacienteProvider } from 'src/providers/paciente';
import { ErrorReporterProvider } from 'src/providers/errorReporter';
import { ActivatedRoute, Router } from '@angular/router';
// page

@Component({
    selector: 'app-turnos-calendario',
    templateUrl: 'turnos-calendario.html'
})

export class TurnosCalendarioPage implements OnInit {
    private onResumeSubscription: Subscription;
    public efector: any;
    private prestacion: any;
    user: any;
    familiar = false;

    public agendas: any;
    public confirmado = false;
    public turnoToShow = null;
    public showConfirmationSplash = false;
    constructor(
        public navCtrl: NavController,
        public turnosProvider: TurnosProvider,
        public agendasProvider: AgendasProvider,
        public navParams: NavParams,
        public authService: AuthProvider,
        public pacienteProvider: PacienteProvider,
        private toast: ToastProvider,
        public alertCtrl: AlertController,
        public reporter: ErrorReporterProvider,
        public platform: Platform,
        public storage: Storage,
        public route: ActivatedRoute,
        public router: Router
    ) {

        this.storage.get('familiar').then((value) => {
            if (value) {
                this.user = value;
                this.familiar = true;
            } else {
                this.user = this.authService.user.pacientes[0];
            }
        });
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.prestacion = JSON.parse(params.prestacion);
            this.efector = JSON.parse(params.efector);
            this.agendas = this.efector.agendas;
            console.log('agendas ', this.agendas);
            this.refreshAgendas();
        });
    }

    ionViewDidLoad() {
        // para solucionar el bug de navegabilidad (mejorar más adelante)
        this.refreshAgendas();
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
        const pacienteId = this.user.id;
        const prestacion = this.prestacion;
        this.pacienteProvider.get(pacienteId).then((paciente: any) => {
            // Se busca entre los contactos del paciente un celular
            let telefono = '';
            if (paciente && paciente.contacto) {
                if (paciente.contacto.length > 0) {
                    paciente.contacto.forEach((contacto) => {
                        if (contacto.tipo === 'celular') {
                            telefono = contacto.valor;
                        }
                    });
                }
            }
            // Datos del paciente
            const pacienteSave = {
                id: paciente.id,
                documento: paciente.documento,
                apellido: paciente.apellido,
                nombre: paciente.nombre,
                alias: paciente.alias,
                fechaNacimiento: paciente.fechaNacimiento,
                sexo: paciente.sexo,
                telefono,
                carpetaEfectores: paciente.carpetaEfectores
            };
            // Datos del Turno
            const datosTurno = {
                idAgenda: agenda._id,
                idTurno: turno._id,
                idBloque: bloque._id,
                paciente: pacienteSave,
                tipoPrestacion: prestacion,
                tipoTurno: 'programado',
                emitidoPor: 'appMobile',
                nota: 'Turno pedido desde app móvil',
                motivoConsulta: ''
            };
            this.agendasProvider.save(datosTurno, { showError: false }).subscribe(() => {
                this.storage.set('familiar', '');
                this.toast.success('Turno asignado correctamente');
                this.router.navigate(['/home']);

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

    cancelar() {
        this.refreshAgendas();
    }

    refreshAgendas() {
        this.agendas.sort((agendaA, agendaB) => {
            return new Date(agendaA.horaInicio).getTime() - new Date(agendaB.horaInicio).getTime();
        });
        this.agendas.forEach(agenda => {
            this.agendasProvider.getById(agenda._id).subscribe(agendaRefresh => {
                const indice = this.agendas.indexOf(agenda);
                if (indice !== -1) {
                    this.agendas.splice(indice, 1);
                }
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
        for (let i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
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
