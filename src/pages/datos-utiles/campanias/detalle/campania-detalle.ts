import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ErrorReporterProvider } from '../../../../providers/errorReporter';


@Component({
    selector: 'page-campania-detalle',
    templateUrl: 'campania-detalle.html'
})
export class CampaniaDetallePage {
    campania;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public reporter: ErrorReporterProvider) {
        this.campania = this.navParams.get('campania');
    }

    onBugReport() {
        this.reporter.report();
    }

}
