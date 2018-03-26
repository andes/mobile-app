import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { LocationsProvider } from '../../../../providers/locations/locations';
import { GeoProvider } from '../../../../providers/geo-provider';

import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Device } from '@ionic-native/device';

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

export class MapPage {
    geoSubcribe;
    /* Es el CS seleccionado en la lista de CS mas cercaos*/
    public centroSaludSeleccionado: any;

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
        this.center.latitude = centro.coordenadasDeMapa.latitud;
        this.center.longitude = centro.coordenadasDeMapa.longitud;
    }

    navigateTo(location) {
        window.open('geo:?q=' + location.latitud + ',' + location.longitud);
    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            this._locationsSubscriptions = this.locations.getV2().subscribe((centros: any) => {
                this.centros = centros;
            });

            if (this.platform.is('cordova')) {
                this.diagnostic.isLocationAvailable().then((available) => {
                    if (!available) {
                        this.requestGeofef();
                    } else {
                        this.geoPosicionarme();
                    }
                }, function (error) {
                    alert("The following error occurred: " + error);
                });
            } else {
                this.geoPosicionarme();
            }
        }).catch((error: any) => {
            console.log(error)
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
        if ((this.device.platform === "Android" && state !== this.diagnostic.locationMode.LOCATION_OFF)
            || (this.device.platform === "iOS") && (state === this.diagnostic.permissionStatus.GRANTED
                || state === this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE
            )) {

            this.geoPosicionarme();

        }
    }

    geoPosicionarme() {
        this.geoSubcribe = this.maps.watchPosition().subscribe((position: any) => {
            this.myPosition = position.coords;
        });
    }
}

