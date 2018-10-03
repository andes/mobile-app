import { Component, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
import { LocationsProvider } from '../../../providers/locations/locations';
import { GeoProvider } from '../../../providers/geo-provider';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Device } from '@ionic-native/device';

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
    private _locationsSubscriptions = null;
    points: any[];
    position: any = {};
    lugares: any[];
    loading = false;

    constructor(
        public navCtrl: NavController,
        public turnosProvider: TurnosProvider,
        public agendasProvider: AgendasProvider,
        public navParams: NavParams,
        private toast: ToastProvider,
        private geolocation: Geolocation,
        public locations: LocationsProvider,
        public gMaps: GeoProvider,
        private diagnostic: Diagnostic,
        private device: Device,
        public alertCtrl: AlertController,
        public platform: Platform) {

        this.getTurnosDisponibles();
        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.getTurnosDisponibles();
        });
    }

    getTurnosDisponibles() {
        this.loading = true;
        let params = { horaInicio: moment(new Date()).format() };
        this.agendasProvider.getAgendasDisponibles(params).then((data: any[]) => {
            debugger;
            this.loadEfectoresPositions(data);
        }).catch((err) => {
            // console.log('Error en la api');
            console.log('error horrible en la api: ', err);
        });
    }

    mostrarEfector(efector) {
        return efector.organizacion;
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


    // Sección GPS
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
            let placeLocation = {
                lat: data[i].coordenadasDeMapa.latitud,
                lng: data[i].coordenadasDeMapa.longitud
            };

            data[i].distance = this.gMaps.getDistanceBetweenPoints(
                userLocation,
                placeLocation,
                'km'
            ).toFixed(2);

            // Limitamos a 10 km los turnos a mostrar
            if (data[i].distance > 10) {
                data.splice(i, 1);
            }
            data.sort((locationA, locationB) => {
                return locationA.distance - locationB.distance;
            });
        }
        this.loading = false;
        return this.efectores = data;
    }


}
