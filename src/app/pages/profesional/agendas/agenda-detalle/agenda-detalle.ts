import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AgendasProvider } from 'src/providers/agendas';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-agenda-detalle',
    templateUrl: 'agenda-detalle.html'
})
export class AgendaDetallePage implements OnInit, OnDestroy {
    agenda: any = null;
    turnos: any[] = [];

    private onResumeSubscription: Subscription;
    prestaciones: any;

    constructor(
        private agendasProvider: AgendasProvider,
        private platform: Platform,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.onResumeSubscription = this.platform.resume.subscribe(() => {
        });
        this.route.queryParams.subscribe(params => {
            const idAgenda = params.agenda;
            this.agendasProvider.getById(idAgenda).subscribe((data: any) => {
                this.agenda = data;
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
        });
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

}
