import { Component, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { AgendasProvider } from '../../../providers/agendas';
import { TurnosProvider } from '../../../providers/turnos';
import { ToastProvider } from '../../../providers/toast';

// Pages
import { TurnosCalendarioPage } from '../calendario/turnos-calendario';


@Component({
    selector: 'page-turnos-buscar',
    templateUrl: 'turnos-buscar.html'
})

export class TurnosBuscarPage {

    efectores: any[] = null;
    private onResumeSubscription: Subscription;

    constructor(
        public navCtrl: NavController,
        public turnosProvider: TurnosProvider,
        public agendasProvider: AgendasProvider,
        public navParams: NavParams,
        private toast: ToastProvider,
        public alertCtrl: AlertController,
        public platform: Platform) {

        this.getTurnosDisponibles();
        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.getTurnosDisponibles();
        });
    }

    getTurnosDisponibles() {
        let params = { horaInicio: moment(new Date()).format() };
        this.agendasProvider.getAgendasDisponibles(params).then((data: any[]) => {
            this.efectores = data;
        }).catch(() => {
            // console.log('Error en la api');
        });
    }

    ionViewDidLoad() {
    }

    mostrarEfector(efector) {
        return efector._id.id;
    }

    turnosDisponibles(efector) {
        let agendasEfector = [];
        let listaTurnosDisponibles = [];
        agendasEfector = efector.agendas;

        agendasEfector.forEach(agenda => {
            agenda.bloques.forEach(bloque => {
                bloque.turnos.forEach(turno => {
                    if (turno.estado === 'disponible') {
                        listaTurnosDisponibles.push(turno);
                    }
                });
            });
        });
        return listaTurnosDisponibles;
    }

    buscarTurno(efector) {
        this.navCtrl.push(TurnosCalendarioPage, { efector: efector });
    }

}
