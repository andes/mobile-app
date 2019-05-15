import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
import { LocationsProvider } from '../../../providers/locations/locations';
import { GeoProvider } from '../../../providers/geo-provider';

// providers
import { AgendasProvider } from '../../../providers/agendas';
import { TurnosProvider } from '../../../providers/turnos';
import { CheckerGpsProvider } from '../../../providers/locations/checkLocation';
import { ToastProvider } from '../../../providers/toast';
import { ErrorReporterProvider } from '../../../providers/errorReporter';

// Pages
import { TurnosCalendarioPage } from '../calendario/turnos-calendario';

@Component({
    selector: 'page-turnos-buscar',
    templateUrl: 'turnos-buscar.html'
})

export class TurnosBuscarPage implements OnDestroy {

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
        public agendasProvider: AgendasProvider,
        public navParams: NavParams,
        public locations: LocationsProvider,
        public gMaps: GeoProvider,
        private checker: CheckerGpsProvider,
        public alertCtrl: AlertController,
        public toast: ToastProvider,
        public reporter: ErrorReporterProvider,
        public platform: Platform) {

        this.prestacion = this.navParams.get('prestacion');

        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.checker.checkGPS();
        });
    }

    ionViewDidLoad() {
        this.getTurnosDisponibles();
    }

    getTurnosDisponibles() {
        if (this.gMaps.actualPosition) {
            let userLocation = { lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude }
            this.getTurnosDisponiblesAux(userLocation);
        } else {
            this.gMaps.getGeolocation().then(position => {
                let userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                this.getTurnosDisponiblesAux(userLocation);
            })
        }
    }
    private getTurnosDisponiblesAux(userLocation) {
        this.agendasProvider.getAgendasDisponibles({ prestacion: this.prestacion, userLocation: userLocation }).then((data: any[]) => {
            this.efectores = data;
        }).catch((err) => {
            this.toast.danger('Ups... se ha producido un error, reintentar.')
        });

    }

    mostrarEfector(efector) {
        return efector.organizacion;
    }

    turnosDisponibles(efector) {
        let agendasEfector = [];
        let listaTurnosDisponibles = [];

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
        this.navCtrl.push(TurnosCalendarioPage, { efector: efector, prestacion: this.prestacion });
    }

    onBugReport() {
        this.reporter.report();
    }

}
