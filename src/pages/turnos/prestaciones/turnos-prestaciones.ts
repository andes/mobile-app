import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';

// providers

import { ToastProvider } from '../../../providers/toast';
import { ErrorReporterProvider } from '../../../providers/errorReporter';
import { AgendasProvider } from '../../../providers/agendas';

// Pages

import { TurnosBuscarPage } from '../buscar/turnos-buscar';
import { GeoProvider } from '../../../providers/geo-provider';


@Component({
    selector: 'page-turnos-prestaciones',
    templateUrl: 'turnos-prestaciones.html'
})

export class TurnosPrestacionesPage implements OnDestroy {

    private onResumeSubscription: Subscription;
    //    private organizacionAgendas: any = [];
    private turnosActuales: any = [];
    private prestacionesTurneables: any = [];
    private organizacionAgendas: any = [];
    private loader = false;

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    constructor(
        public gMaps: GeoProvider,
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
        this.loader = true;
        // this.organizacionAgendas = await this.agendasService.getAgendasDisponibles({});

        if (this.gMaps.actualPosition) {
            let userLocation = { lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude }
            this.agendasService.getAgendasDisponibles({ userLocation: userLocation }).then((data: any[]) => {
                if (data) {
                    this.organizacionAgendas = data;
                    this.buscarPrestaciones(data);
                } else {
                    this.loader = false;
                }
            }).catch((err) => {
                this.toast.danger('Ups... se ha producido un error, reintentar.')
            });
        } else {
            this.gMaps.getGeolocation().then(position => {
                let userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                this.agendasService.getAgendasDisponibles({ userLocation: userLocation }).then((data: any[]) => {
                    if (data) {
                        this.organizacionAgendas = data;
                        this.buscarPrestaciones(data);
                    } else {
                        this.loader = false;
                    }
                }).catch((err) => {
                    this.toast.danger('Ups... se ha producido un error, reintentar.')
                });
            })
        }
    }

    // Busca los tipos de prestación turneables y verifica que ya el paciente no haya sacado un turno para ese tipo de prestación. (1 turno por tipo de prestación)
    buscarPrestaciones(organizacionAgendas) {

        this.prestacionesTurneables = [];
        this.loader = false;
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
        let organizaciones = this.organizacionAgendas.filter(unaOrg =>
            unaOrg.agendas.filter(unaAgenda =>
                unaAgenda.tipoPrestaciones.filter(unTipoPrestacion => unTipoPrestacion.conceptId === prestacion.conceptId)
            )
        );
        this.navCtrl.push(TurnosBuscarPage, { organizaciones: organizaciones, prestacion: prestacion });
    }

    onBugReport() {
        this.reporter.report();
    }

}
