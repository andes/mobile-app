import { NavController, NavParams, Platform } from 'ionic-angular';
import { Component, OnDestroy } from '@angular/core';
// Providers
import { CheckerGpsProvider } from '../../../providers/locations/checkLocation';
import { GeoProvider } from '../../../providers/geo-provider';

declare var google;

@Component({
    selector: 'turnos-mapa',
    templateUrl: 'mapa.html',
    styles: [`
        agm-map {
            height: 100%;
            width: 100%;
        }
    `],
})

export class MapTurnosPage implements OnDestroy {
    geoSubcribe;
    myPosition = null;
    centro: any = null;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        private checker: CheckerGpsProvider,
        public maps: GeoProvider) {

        this.checker.checkGPS();
        this.centro = this.navParams.get('centro');
    }

    private zoom = 14;
    private _locationsSubscriptions = null;


    ngOnDestroy() {
        if (this._locationsSubscriptions) {
            this._locationsSubscriptions.unsubscribe();
        }
        if (this.geoSubcribe) {
            this.geoSubcribe.unsubscribe();
        }
    }

    navigateTo() {
        if (this.platform.is('ios')) {
            window.open('maps://?q=' + this.centro.location.latitud + ',' + this.centro.location.longitud, '_system');
        }
        if (this.platform.is('android')) {
            window.open('geo:?q=' + this.centro.location.latitud + ',' + this.centro.location.longitud);
        }
    }



}

