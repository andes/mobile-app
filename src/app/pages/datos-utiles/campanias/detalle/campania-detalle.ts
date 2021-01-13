import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ErrorReporterProvider } from '../../../../../providers/errorReporter';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CampaniasProvider } from 'src/providers/campanias';

@Component({
    selector: 'app-campania-detalle',
    templateUrl: 'campania-detalle.html'
})
export class CampaniaDetallePage implements OnInit {
    public loading = true;
    public campania;
    public imagen;

    constructor(
        private sanitizer: DomSanitizer,
        private iab: InAppBrowser,
        private reporter: ErrorReporterProvider,
        private activatedRoute: ActivatedRoute,
        private campaniasProvider: CampaniasProvider) {
    }

    ngOnInit() {
        this.activatedRoute
            .queryParams
            .subscribe(params => {
                const idCampania = params.campania;
                this.campaniasProvider.getById(idCampania).then(async (data: any[]) => {
                    this.campania = data;
                    this.imagen = this.sanitizer.bypassSecurityTrustHtml(this.campania.imagen);
                    this.loading = false;
                });
            });
    }

    onBugReport() {
        this.reporter.report();
    }

    navigateTo(link) {
        const https = 'https://';
        const http = 'http://';
        if (link.startsWith(https) || link.startsWith(http)) {
            this.iab.create(link);
        } else {
            this.iab.create(`http://${link}`);
        }
    }

}
