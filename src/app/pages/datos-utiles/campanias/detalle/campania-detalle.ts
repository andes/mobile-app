import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ErrorReporterProvider } from '../../../../../providers/library-services/errorReporter';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CampaniasProvider } from 'src/providers/campanias';
import { StorageService } from 'src/providers/storage-provider.service';

@Component({
    selector: 'app-campania-detalle',
    templateUrl: 'campania-detalle.html'
})
export class CampaniaDetallePage implements OnInit {
    public loading = true;
    public campania;
    public imagen;
    public familiar: any = false;

    constructor(
        private sanitizer: DomSanitizer,
        private iab: InAppBrowser,
        private reporter: ErrorReporterProvider,
        private activatedRoute: ActivatedRoute,
        private campaniasProvider: CampaniasProvider,
        private storage: StorageService) {
    }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
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
