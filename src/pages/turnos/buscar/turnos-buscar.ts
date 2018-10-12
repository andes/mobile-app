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
import { HomePage } from '../../home/home';


@Component({
    selector: 'page-turnos-buscar',
    templateUrl: 'turnos-buscar.html'
})

export class TurnosBuscarPage implements OnDestroy {

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
        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.checker.checkGPS();
        });
    }

    ionViewDidLoad() {
        this.getTurnosDisponibles();
    }

    getTurnosDisponibles() {
        let params = { horaInicio: moment(new Date()).format() };
        this.agendasProvider.getAgendasDisponibles(params).then((data: any[]) => {
            this.loadEfectoresPositions(data);
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
        agendasEfector = this.filtrarAgendas(efector.agendas);

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

    /**
  * Filtramos las agendas que tienen otorgados menos de 4 turnos desde app mobile
  *
  * @param {*} agendas coleccion de agendas
  * @returns
  * @memberof TurnosCalendarioPage
  */
    filtrarAgendas(agendas) {
        let agendasFiltradas = agendas.filter(agenda => {
            let turnosMobile = [];
            agenda.bloques.forEach(bloque => {
                turnosMobile = bloque.turnos.filter(turno => { return turno.emitidoPor === 'appMobile' })
            });
            return (turnosMobile.length < 4);
        });

        return agendasFiltradas;
    }

    buscarTurno(efector) {
        this.navCtrl.push(TurnosCalendarioPage, { efector: efector });
    }

    loadEfectoresPositions(data) {

        if (this.gMaps.actualPosition) {
            this.applyHaversine({ lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude }, data);
            data = data.slice(0, 5);
        } else {
            this.gMaps.getGeolocation().then(position => {
                this.applyHaversine({ lat: position.coords.latitude, lng: position.coords.longitude }, data);
                data = data.slice(0, 5);
            })
        }
    }

    applyHaversine(userLocation, data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].coordenadasDeMapa) { // Chequeamos que existan las coordenadas de mapa para georeferenciar
                let placeLocation = {
                    lat: data[i].coordenadasDeMapa.latitud,
                    lng: data[i].coordenadasDeMapa.longitud
                };
                data[i].distance = this.gMaps.getDistanceBetweenPoints(
                    userLocation,
                    placeLocation,
                    'km'
                ).toFixed(2);

            } else {
                // eliminar del array el que no tiene la información de coordenada de mapa
                data.splice(i, 1);
                i--;
            }

        }
        data.sort((locationA, locationB) => {
            return locationA.distance - locationB.distance;
        });
        // Limitamos a 10 km los turnos a mostrar (FILTRA LOS MAYORES A 10 KM)
        let filtradoDistancia = data.filter(obj => obj.distance <= 10);

        return this.efectores = [...filtradoDistancia];

    }

    onBugReport() {
        this.reporter.report();
    }

}
