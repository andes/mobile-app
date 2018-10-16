import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ErrorReporterProvider } from '../../../../providers/errorReporter';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'page-campania-detalle',
    templateUrl: 'campania-detalle.html'
})
export class CampaniaDetallePage {

    // inject DomSanitizer in constructor
    private myImage: SafeHtml;

    campania;
    imagen;

    constructor(
        private sanitizer: DomSanitizer,
        public navCtrl: NavController,
        public navParams: NavParams,
        private iab: InAppBrowser,
        public reporter: ErrorReporterProvider) {

        this.campania = this.navParams.get('campania');
        this.imagen = sanitizer.bypassSecurityTrustHtml(this.campania.imagen);
    }

    onBugReport() {
        this.reporter.report();
    }

    navigateTo(link) {
        const browser = this.iab.create(link);
    }

}
