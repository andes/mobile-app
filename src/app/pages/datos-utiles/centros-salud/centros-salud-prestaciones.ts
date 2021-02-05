import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-cs-prestaciones',
    templateUrl: 'centros-salud-prestaciones.html',
    styleUrls: ['centros-salud-prestaciones.scss'],
})

export class CentrosSaludPrestacionesPage implements OnInit, OnDestroy {
    private onResumeSubscription: Subscription;
    centro: any = null;
    prestaciones: any[];

    constructor(
        private platform: Platform,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.onResumeSubscription = this.platform.resume.subscribe();
        this.route.queryParams.subscribe(params => {
            this.centro = JSON.parse(params.centroSalud);
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
