import { Component, OnDestroy } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Platform } from 'ionic-angular/platform/platform';

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'centros-salud-prestaciones',
    templateUrl: 'centros-salud-prestaciones.html',
    styles: ['centros-salud-prestaciones.html'],
})

export class CentrosSaludPrestaciones implements OnDestroy {

    private onResumeSubscription: Subscription;

    centro: any;
    prestaciones: any[];

    constructor(
        public navParams: NavParams,
        public platform: Platform
    ) {
        this.onResumeSubscription = platform.resume.subscribe();
    }

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    ionViewDidLoad() {
        this.centro = this.navParams.get('centroSalud');
        if (this.centro && this.centro.ofertaPrestacional.length > 0) {
            this.prestaciones = this.centro.ofertaPrestacional;
        }
    }

    call(phone) {
        window.open('tel:' + phone);
    }

    navigateTo(longitud, latitud) {
        if (this.platform.is('ios')) {
            window.open('maps://?q=' + longitud + ',' + latitud, '_system');
        }
        if (this.platform.is('android')) {
            window.open('geo:?q=' + longitud + ',' + latitud);
        }
    }
}
