import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ErrorReporterProvider } from '../../../../../providers/errorReporter';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CampaniasProvider } from 'src/providers/campanias';

@Component({
    selector: 'app-campania-detalle',
    templateUrl: 'campania-detalle.html'
})
export class CampaniaDetallePage {

    public loading = true;
    campania;
    imagen;

    constructor(
        private sanitizer: DomSanitizer,
        private iab: InAppBrowser,
        public reporter: ErrorReporterProvider,
        private activatedRoute: ActivatedRoute,
        private campaniasProvider: CampaniasProvider) {
        this.activatedRoute
            .queryParams
            .subscribe(params => {
                const idCampania = params['campania'];
                this.campaniasProvider.getById(idCampania).then(async (data: any[]) => {
                    this.campania = data;
                    this.loading = false;
                })
            });
    }

    ionViewDidLoad() {
        this.imagen = this.sanitizer.bypassSecurityTrustHtml(this.campania.imagen);
    }


    onBugReport() {
        this.reporter.report();
    }

    navigateTo(link) {
        let https = 'https://';
        let http = 'http://';
        if (link.startsWith(https) || link.startsWith(http)) {
            const browser = this.iab.create(link);
        } else {

            const browser = this.iab.create(`http://${link}`);
        }
    }

}
