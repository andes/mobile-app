import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers

import { ToastProvider } from '../../../providers/toast';
import { ErrorReporterProvider } from '../../../providers/errorReporter';

// Pages

import { HomePage } from '../../home/home';
import { TurnosBuscarPage } from '../buscar/turnos-buscar';


@Component({
    selector: 'page-turnos-prestaciones',
    templateUrl: 'turnos-prestaciones.html'
})

export class TurnosPrestacionesPage implements OnDestroy {

    private onResumeSubscription: Subscription;
    private prestaciones = [
        { nombre: 'Medicina General', conceptId: '391000013108' }, { nombre: 'Ginecología', conceptId: '721000013105' }, { nombre: 'Odontología', conceptId: '34043003' }]

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public toast: ToastProvider,
        public reporter: ErrorReporterProvider,
        public platform: Platform) {

        this.onResumeSubscription = platform.resume.subscribe(() => {
            // this.checker.checkGPS();
        });
    }

    ionViewDidLoad() {
        // this.getTurnosDisponibles();
    }

    buscarTurnoPrestacion(prestacion) {
        this.navCtrl.push(TurnosBuscarPage, { prestacion: prestacion });
    }

    onBugReport() {
        this.reporter.report();
    }

}
