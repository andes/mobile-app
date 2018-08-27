import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { AgendasProvider } from '../../../providers/agendas';
import { AuthProvider } from '../../../providers/auth/auth';
import { AgendaDetallePage } from '../../../pages/profesional/agendas/agenda-detalle/agenda-detalle';

@Component({
    selector: 'page-agendas',
    templateUrl: 'agendas.html'
})
export class AgendasPage implements OnDestroy {
    agendas: any[] = null;

    private onResumeSubscription: Subscription;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public agendasProvider: AgendasProvider,
        public authProvider: AuthProvider,
        public platform: Platform) {

        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.getAgendas();
        });

        this.getAgendas();
    }

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    getAgendas() {
        let data = {
            estados: ['publicada', 'disponible'],
            idProfesional: this.authProvider.user.profesionalId,
            fechaDesde: moment(new Date()).startOf('day').toISOString()
        };

        this.agendasProvider.get(data).then((_data: any[]) => {
            this.agendas = _data;
        })
    }

    onCancelAgenda($event) {
        // console.log('onCancelAgenda');
    }

    verDetalle(agenda) {
        this.navCtrl.push(AgendaDetallePage, { agenda });
    }

}
