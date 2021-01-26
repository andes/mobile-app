import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
import { TurnosProvider } from 'src/providers/turnos';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
    selector: 'app-turnos',
    templateUrl: './turnos.page.html'
})

export class TurnosPage implements OnDestroy, OnInit {
    public familiar: any = false;
    public turnos: any[] = null;
    public habilitarTurnos = false;
    private onResumeSubscription: Subscription;

    constructor(
        private menuCtrl: MenuController,
        private platform: Platform,
        private storage: Storage,
        private turnosProvider: TurnosProvider,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            this.onResumeSubscription = this.platform.resume.subscribe(() => {
                this.getTurnos();
            });
            this.getTurnos();
        });
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true, 'historial');
    }

    getTurnos() {
        const params = { horaInicio: moment(new Date()).format(), familiar: JSON.stringify(this.familiar) };
        this.turnosProvider.get(params).subscribe((data: any[]) => {
            this.turnos = data;
            console.log(data);
            this.habilitarTurnos = true;
        });
    }

    onCancelTurno($event) {
        this.turnos = this.turnos.filter(item => item._id !== $event._id);
    }

    clickEvent($event) {
        this.router.navigate(['/turnos/detalle'], { queryParams: { turno: JSON.stringify($event) } });
    }

    buscarPrestacion() {
        this.turnosProvider.storage.set('turnos', { turnos: this.turnos });
        this.router.navigate(['/turnos/prestaciones']);
    }

    abrirHistorial() {
        this.router.navigate(['/turnos/historial']);
    }
}
