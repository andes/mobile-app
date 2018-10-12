import { Injectable } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Device } from '@ionic-native/device';
import { GeoProvider } from '../../providers/geo-provider';


@Injectable()
export class CheckerGpsProvider {
    geoSubcribe;
    myPosition = null;

    constructor(
        public alertCtrl: AlertController,
        public platform: Platform,
        private diagnostic: Diagnostic,
        private device: Device,
        public gMaps: GeoProvider) { }

    checkGPS() {
        if (this.platform.is('cordova')) {
            this.diagnostic.isLocationEnabled().then((available) => {
                if (!available) {
                    this.requestGeofef();
                } else {
                    this.geoPosicionarme();
                }
            }, function (error) {
                alert('Ha ocurrido un error: ' + error);
            });
        } else {
            this.geoPosicionarme();
        }
    };

    requestGeofef() {
        let alert = this.alertCtrl.create({
            title: 'Acceder a ubicación',
            subTitle: 'Para este acceder a este servicio, deberá activar su GPS.',
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
        this.geoSubcribe = this.gMaps.watchPosition().subscribe((position: any) => {
            this.gMaps.setActual(this.myPosition);
            this.myPosition = position.coords;
        });
    }
};
