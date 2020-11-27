import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { RupProvider } from 'src/providers/rup';

// providers
import { AuthProvider } from 'src/providers/auth/auth';
import { ToastProvider } from 'src/providers/toast';
import { Router } from '@angular/router';

@Component({
    selector: 'app-rup-consultorio',
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
        public toast: ToastProvider,
        public router: Router
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
                this.router.navigate(['profesional/adjuntar'], {queryParams: {id: data[0]._id }});
                // const index = this.navCtrl.length() - 1;
                // this.navCtrl.push(RupAdjuntarPage, { id: data[0]._id }).then(() => {
                    //     this.navCtrl.remove(index);
                    // });
                }
            this.solicitudes = data;
        }).catch(() => {
            this.solicitudes = [];
        });
    }

    onClick(solicitud) {
        this.router.navigate(['profesionales/adjuntar'], {queryParams: {id: solicitud._id }});
    }

}
