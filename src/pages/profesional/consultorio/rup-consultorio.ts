import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { AuthProvider } from '../../../providers/auth/auth';
import { RupProvider } from '../../../providers/rup';
import { ToastProvider } from '../../../providers/toast';
import { RupAdjuntarPage } from '../rup-adjuntar/rup-adjuntar';

@Component({
    selector: 'page-rup-consultorio',
    templateUrl: 'rup-consultorio.html'
})
export class RupConsultorioPage implements OnDestroy {

    private onResumeSubscription: Subscription;
    private solicitudes: any[];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public rup: RupProvider,
        public authProvider: AuthProvider,
        public platform: Platform,
        public toast: ToastProvider) {

        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.buscarSolicitudes();
        });

        this.buscarSolicitudes();
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

    buscarSolicitudes() {
        this.rup.get({}).then((data: any) => {
            if (data && data.length > 0) {
                const index = this.navCtrl.length() - 1;
                this.navCtrl.push(RupAdjuntarPage, { id: data[0]._id }).then(() => {
                    this.navCtrl.remove(index);
                });
            }
            this.solicitudes = data;
        }).catch(() => {
            this.solicitudes = [];
        });
    }

    onClick(solicitud) {
        this.navCtrl.push(RupAdjuntarPage, { id: solicitud._id });
    }

}
