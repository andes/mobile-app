import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
// import { TipoPrestacionService } from '../../services/tipoPrestacion-service';
import { Subscription } from 'rxjs';

import * as moment from 'moment/moment';

@Component({
    selector: 'page-turno-detalle',
    templateUrl: 'turno-detalle.html'
})
export class TurnosDetallePage {

    private onResumeSubscription: Subscription;
    private turno: any;

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        // this.onResumeSubscription.unsubscribe();
    }

    profesionalName() {

        return this.turno.profesionales[0].apellido + ' ' + this.turno.profesionales[0].nombre;
    }

    turnoFecha() {
        return moment(this.turno.horaInicio).format('DD/MM/YY');
    }

    turnoHora() {
        return moment(this.turno.horaInicio).format('HH:mm');
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform) {
            this.turno = this.navParams.get('turno');
    }

    ionViewDidLoad() {
    }

}
