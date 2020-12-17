import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavParams, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'app-cs-prestaciones',
    templateUrl: 'centros-salud-prestaciones.html',
    styles: ['centros-salud-prestaciones.html'],
})

export class CentrosSaludPrestacionesPage implements OnInit, OnDestroy {

    private onResumeSubscription: Subscription;

    centro: any;
    prestaciones: any[];

    constructor(
        public navParams: NavParams,
        public platform: Platform,
        public route: ActivatedRoute
    ) {
        this.onResumeSubscription = platform.resume.subscribe();
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.centro = params.centroSalud;
            if (this.centro && this.centro.ofertaPrestacional.length > 0) {
                this.prestaciones = this.centro.ofertaPrestacional;
            }
        });
    }

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
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
