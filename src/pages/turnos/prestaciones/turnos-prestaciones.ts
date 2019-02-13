import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers

import { ToastProvider } from '../../../providers/toast';
import { ErrorReporterProvider } from '../../../providers/errorReporter';
import { AgendasProvider } from '../../../providers/agendas';

// Pages

import { HomePage } from '../../home/home';
import { TurnosBuscarPage } from '../buscar/turnos-buscar';


@Component({
    selector: 'page-turnos-prestaciones',
    templateUrl: 'turnos-prestaciones.html'
})

export class TurnosPrestacionesPage implements OnDestroy {

    private onResumeSubscription: Subscription;
    private organizacionAgendas: any = [];
    private turnosActuales: any = [];
    private prestacionesTurneables: any = [];
    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public toast: ToastProvider,
        public reporter: ErrorReporterProvider,
        public agendasService: AgendasProvider,
        public platform: Platform) {

        this.onResumeSubscription = platform.resume.subscribe(() => {
            // this.checker.checkGPS();
        });
        this.turnosActuales = this.navParams.get('turnos');
    }

    // Trae las prestaciones que posen cupo para mobile.
    async ionViewDidLoad() {
        this.organizacionAgendas = await this.agendasService.getAgendasDisponibles({});
        this.buscarPrestaciones(this.organizacionAgendas);
    }

    // Busca los tipos de prestación turneables y verifica que ya el paciente no haya sacado un turno para ese tipo de prestación. (1 turno por tipo de prestación)
    buscarPrestaciones(organizacionAgendas) {
        this.prestacionesTurneables = [];
        organizacionAgendas.forEach(org => {
            org.agendas.forEach(agenda => {
                agenda.bloques.forEach(bloque => {
                    if (bloque.restantesMobile > 0) {
                        bloque.tipoPrestaciones.forEach(prestacion => {
                            let exists = this.prestacionesTurneables.some(elem => elem.conceptId === prestacion.conceptId);
                            let conTurno = this.turnosActuales.some(turno => turno.tipoPrestacion.conceptId === prestacion.conceptId)
                            if (!exists && !conTurno) {
                                this.prestacionesTurneables.push(prestacion);
                            }
                        });
                    }
                });
            });
        });
    }

    buscarTurnoPrestacion(prestacion) {
        this.navCtrl.push(TurnosBuscarPage, { prestacion: prestacion });
    }

    onBugReport() {
        this.reporter.report();
    }

}
