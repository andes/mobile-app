import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'turnos-mapa',
    templateUrl: 'mapa.html',
    styles: [`
        google-map {
            display: block;
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
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
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
        const lat = this.centro.location.latitud;
        const lng = this.centro.location.longitud;

        if (this.platform.is('ios')) {
            window.open('maps://?q=' + lat + ',' + lng, '_system');
        }

        if (this.platform.is('android')) {
            window.open('geo:?q=' + lat + ',' + lng);
        }
    }
}
