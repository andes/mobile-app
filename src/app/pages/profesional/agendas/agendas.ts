import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
// providers
import { AgendasProvider } from 'src/providers/agendas';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-agendas',
    templateUrl: 'agendas.html'
})
export class AgendasPage implements OnInit, OnDestroy {
    agendas: any[] = null;

    private onResumeSubscription: Subscription;
    agendasFiltradas: any;

    constructor(
        private router: Router,
        private agendasProvider: AgendasProvider,
        public authProvider: AuthProvider,
        private platform: Platform) {
    }

    ngOnInit() {
        this.onResumeSubscription = this.platform.resume.subscribe(() => {
            this.getAgendas();
        });
        this.getAgendas();
    }

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    getAgendas() {
        const params = {
            estados: ['publicada', 'disponible'],
            idProfesional: this.authProvider.user.profesionalId,
            fechaDesde: moment(new Date()).startOf('day').toISOString()
        };

        this.agendasProvider.get(params).subscribe((data: any) => {
            this.agendas = this.agendasFiltradas = data;
        });
    }

    verDetalle(agenda) {
        this.router.navigate(['/profesional/agenda-detalle'], { queryParams: { agenda: agenda.id } });
    }

    filtrarEfector(input) {
        if (input.target.value) {
            this.agendasFiltradas = this.agendas.filter(x =>
                x.organizacion.nombre.toLowerCase().includes(input.target.value.toLowerCase()));
        }
    }

    resetAgendas() {
        this.agendasFiltradas = this.agendas;
    }

}
