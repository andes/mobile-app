import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { AgendasProvider } from 'src/providers/agendas';
import { AuthProvider } from 'src/providers/auth/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-agenda-detalle',
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
        public platform: Platform,
        public route: ActivatedRoute) {

        this.onResumeSubscription = platform.resume.subscribe(() => {
        });

        this.route.queryParams.subscribe(params => {
            this.agenda = JSON.parse(params.agenda);
            for (const sobreturno of this.agenda.sobreturnos) {
                sobreturno.esSobreturno = true;
                this.turnos.push(sobreturno);
            }
            for (const bloque of this.agenda.bloques) {
                for (const turno of bloque.turnos) {
                    if (turno.estado === 'asignado') {
                        this.turnos.push(turno);
                    }
                }
            }
            this.turnos = this.turnos.sort((a, b) => {
                return a.horaInicio.localeCompare(b.horaInicio);
            });
        });


    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

}
