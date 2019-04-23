import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Component, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { LocationsProvider } from '../../../../providers/locations/locations';
import { GeoProvider } from '../../../../providers/geo-provider';

import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Device } from '@ionic-native/device';
import { ToastProvider } from '../../../../providers/toast';

// Pages
import { CentrosSaludPrestaciones } from '../centros-salud-prestaciones'

declare var google;

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
    styles: [`
        agm-map {
            height: 100%;
            width: 100%;
        }
    `],
})

export class MapPage implements OnDestroy {

    @ViewChild('infoWindow') infoWindow: ElementRef;

    geoSubcribe;
    /* Es el CS seleccionado en la lista de CS mas cercaos*/
    public centroSaludSeleccionado: any;
    public prestaciones: any = [];
    public center = {
        latitude: -38.951625,
        longitude: -68.060341
    };

    myPosition = null;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public maps: GeoProvider,
        public platform: Platform,
        public locations: LocationsProvider,
        private geolocation: Geolocation,
        private toast: ToastProvider,
        private diagnostic: Diagnostic,
        private device: Device,
        private alertCtrl: AlertController) {

        this.centroSaludSeleccionado = this.navParams.get('centroSeleccionado');
    }

    private zoom = 14;
    private _locationsSubscriptions = null;
    public centros: any[] = [];

    ngOnDestroy() {
        if (this._locationsSubscriptions) {
            this._locationsSubscriptions.unsubscribe();
        }
        if (this.geoSubcribe) {
            this.geoSubcribe.unsubscribe();
        }
    }

    onClickCentro(centro) {
        // this.center.latitude = centro.direccion.geoReferencia[0];
        // this.center.longitude = centro.direccion.geoReferencia[1];
        (centro.ofertaPrestacional) ? this.prestaciones = centro.ofertaPrestacional : this.prestaciones = [];
    }

    toPrestaciones(centro) {
        this.navCtrl.push(CentrosSaludPrestaciones, { centroSalud: centro });
    }

    navigateTo(longitud, latitud) {
        if (this.platform.is('ios')) {
            window.open('maps://?q=' + longitud + ',' + latitud, '_system');
        }
        if (this.platform.is('android')) {
            window.open('geo:?q=' + longitud + ',' + latitud);
        }
    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            this._locationsSubscriptions = this.locations.getV2().subscribe((centros: any) => {

                this.centros = centros;
            });

            if (this.platform.is('cordova')) {
                this.diagnostic.isLocationEnabled().then((available) => {
                    if (!available) {
                        this.requestGeofef();
                    } else {
                        this.geoPosicionarme();
                    }
                }, function (error) {
                    alert('The following error occurred: ' + error);
                });
            } else {
                this.geoPosicionarme();
            }
        }).catch((error: any) => {
            // console.log(error)
        });
    }

    requestGeofef() {
        let alert = this.alertCtrl.create({
            title: 'Acceder a ubicación',
            subTitle: 'Para poder utilizar este servicio, deberá activar la ubicación en su dispositivo.',
            buttons: [{
                text: 'Continuar',
                handler: () => {
                    this.diagnostic.switchToLocationSettings();
                    this.diagnostic.registerLocationStateChangeHandler(
                        (state) => {
                            this.hayUbicacion(state)
                        });
                }
            }]
        });
        alert.present();
    }

    hayUbicacion(state) {
        if ((this.device.platform === 'Android' && state !== this.diagnostic.locationMode.LOCATION_OFF)
            || (this.device.platform === 'iOS') && (state === this.diagnostic.permissionStatus.GRANTED
                || state === this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE
            )) {
            this.geoPosicionarme();
        }
    }

    geoPosicionarme() {
        this.geoSubcribe = this.maps.watchPosition().subscribe((position: any) => {
            this.maps.setActual(this.myPosition);
            this.myPosition = position.coords;
            // Si me geolocaliza, centra el mapa donde estoy
            this.center.latitude = this.myPosition.latitude;
            this.center.longitude = this.myPosition.longitude
        });
    }
}

