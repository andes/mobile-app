import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { AgendasProvider } from '../../../../providers/agendas';
import { AuthProvider } from '../../../../providers/auth/auth';

@Component({
    selector: 'page-agenda-detalle',
    templateUrl: 'agenda-detalle.html'
})
export class AgendaDetallePage implements OnDestroy {
    agenda: any = null;
    turnos: any[] = [];

    private onResumeSubscription: Subscription;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public agendasProvider: AgendasProvider,
        public authProvider: AuthProvider,
        public platform: Platform) {

        this.onResumeSubscription = platform.resume.subscribe(() => {

        });

        this.agenda = this.navParams.get('agenda');

        for (let sobreturno of this.agenda.sobreturnos) {
            sobreturno.esSobreturno = true;
            this.turnos.push(sobreturno);
        }
        for (let bloque of this.agenda.bloques) {
            for (let turno of bloque.turnos) {
                if (turno.estado === 'asignado') {
                    this.turnos.push(turno);
                }
            }
        }

        this.turnos = this.turnos.sort((a, b) => {
            return a.horaInicio.localeCompare(b.horaInicio);
        });

    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

}
