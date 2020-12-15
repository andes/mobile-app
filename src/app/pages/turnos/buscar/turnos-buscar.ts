import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LocationsProvider } from 'src/providers/locations/locations';
import { GeoProvider } from 'src/providers/geo-provider';

// src/providers
import { AgendasProvider } from 'src/providers/agendas';
import { TurnosProvider } from 'src/providers/turnos';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';
import { ToastProvider } from 'src/providers/toast';
import { ErrorReporterProvider } from 'src/providers/errorReporter';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-turnos-buscar',
    templateUrl: 'turnos-buscar.html'
})

export class TurnosBuscarPage implements OnInit, OnDestroy {

    prestacion: any;
    efectores: any[] = null;
    points: any[];
    position: any = {};
    lugares: any[];
    geoSubcribe;
    myPosition = null;
    private onResumeSubscription: Subscription;

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    constructor(
        public navCtrl: NavController,
        public turnosProvider: TurnosProvider,
        public agendasService: AgendasProvider,
        public navParams: NavParams,
        public locations: LocationsProvider,
        public gMaps: GeoProvider,
        private checker: CheckerGpsProvider,
        public alertCtrl: AlertController,
        public toast: ToastProvider,
        public reporter: ErrorReporterProvider,
        public platform: Platform,
        public route: ActivatedRoute,
        public router: Router
    ) {

        // this.prestacion = this.navParams.get('prestacion');

        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.checker.checkGPS();
        });
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.prestacion = params.prestacion;
            this.getTurnosDisponibles();
        });
    }


    getTurnosDisponibles() {
        if (this.gMaps.actualPosition) {
            const userLocation = { lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude }
            this.getTurnosDisponiblesAux(userLocation);
        } else {
            this.gMaps.getGeolocation().then(position => {
                const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                this.getTurnosDisponiblesAux(userLocation);
            });
        }
    }
    private getTurnosDisponiblesAux(userLocation) {
        this.agendasService.getAgendasDisponibles({ prestacion: this.prestacion, userLocation }).subscribe((data: any[]) => {
            this.efectores = data;
        });
    }

    mostrarEfector(efector) {
        return efector.organizacion;
    }

    turnosDisponibles(efector) {
        const agendasEfector = [];
        const listaTurnosDisponibles = [];

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
        this.router.navigate(['/turnos/calendario'],
            { queryParams: { efector: JSON.stringify(efector), prestacion: this.prestacion } });
    }

    onBugReport() {
        this.reporter.report();
    }

}
