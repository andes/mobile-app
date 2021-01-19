import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';
import { ActivatedRoute } from '@angular/router';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'turnos-mapa',
    templateUrl: 'mapa.html',
    styles: [`
        agm-map {
            height: 100%;
            width: 100%;
        }
    `]
})

export class MapTurnosPage implements OnDestroy, OnInit {
    geoSubcribe;
    myPosition = null;
    centro: any = null;
    public zoom = 14;
    private locationsSubscriptions = null;

    constructor(
        private platform: Platform,
        private checker: CheckerGpsProvider,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.checker.checkGPS();
        this.route.queryParams.subscribe(params => {
            this.centro = JSON.parse(params.centro);
        });
    }

    ngOnDestroy() {
        if (this.locationsSubscriptions) {
            this.locationsSubscriptions.unsubscribe();
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

