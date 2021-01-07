import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
// Pages
import * as moment from 'moment/moment';
// Providers
import { ErrorReporterProvider } from '../../../../providers/errorReporter';
import { CampaniasProvider } from '../../../../providers/campanias';
import { Router } from '@angular/router';


@Component({
    selector: 'app-campanias-list',
    templateUrl: 'campanias-list.html'
})
export class CampaniasListPage {
    campanias = [];
    loading: any;
    constructor(
        public loadingController: LoadingController,
        private campaniasProvider: CampaniasProvider,
        public reporter: ErrorReporterProvider,
        public router: Router
    ) {
        this.getCampanias();
        moment.locale('es');
    }

    ionViewDidLoad() {
    }

    getCampanias() {
        this.loading = true;
        this.campaniasProvider.get().then(async (data: any[]) => {
            this.campanias = data;
            this.loading = false;
        })
    }

    periodo(campania) {
        return ('Desde el ' + moment(campania.vigencia.desde).format('DD [de] MMMM') + ' al ' + moment(campania.vigencia.hasta).format('DD [de] MMMM [del] YYYY'))
    }

    verCampania(campania) {
        this.router.navigate(['campania-detalle'], { 'queryParams': { campania: campania.id } });
    }

    onBugReport() {
        this.reporter.report();
    }


}
