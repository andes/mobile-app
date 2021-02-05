import { Component, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { RupProvider } from 'src/providers/rup';
// providers
import { Router } from '@angular/router';

@Component({
    selector: 'app-rup-consultorio',
    templateUrl: 'rup-consultorio.html'
})
export class RupConsultorioPage implements OnDestroy {

    private onResumeSubscription: Subscription;
    public solicitudes: any[];

    constructor(
        private rup: RupProvider,
        private platform: Platform,
        private router: Router
    ) {

        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.buscarSolicitudes();
        });

        this.buscarSolicitudes();
    }


    ionViewWillEnter() {
        this.onResumeSubscription = this.platform.resume.subscribe(() => {
            this.buscarSolicitudes();
        });
        this.buscarSolicitudes();
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

    buscarSolicitudes() {
        this.solicitudes = [];
        this.rup.get({}).then((data: any) => {
            if (data && data.length > 0) {
                this.router.navigate(['profesional/adjuntar'], { queryParams: { id: data[0]._id } });
            }
            this.solicitudes = data;
        }).catch(() => {
            this.solicitudes = [];
        });
    }

    onClick(solicitud) {
        this.router.navigate(['profesionales/adjuntar'], { queryParams: { id: solicitud._id } });
    }

}
