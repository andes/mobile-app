import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// Pages
import { CampaniaDetallePage } from '../campanias/detalle/campania-detalle';
import * as moment from 'moment/moment';
// Providers
import { ErrorReporterProvider } from '../../../providers/errorReporter';
import { CampaniasProvider } from '../../../providers/campanias';


@Component({
    selector: 'page-campanias-list',
    templateUrl: 'campanias-list.html'
})
export class CampaniasListPage {
    campanias = [];
    constructor(
        public navCtrl: NavController,
        private campaniasProvider: CampaniasProvider,
        public reporter: ErrorReporterProvider) {
        this.getCampanias();
        moment.locale('es');
    }

    ionViewDidLoad() {

    }

    getCampanias() {
        this.campaniasProvider.get().then((data: any[]) => {
            this.campanias = data;
        }).catch((err => {
            // console.log('errorrrrr');
        }))
    }

    periodo(campania) {
        return ('Desde el ' + moment(campania.vigencia.desde).format('DD [de] MMMM') + ' al ' + moment(campania.vigencia.hasta).format('DD [de] MMMM [del] YYYY'))
    }

    verCampania(campania) {
        this.navCtrl.push(CampaniaDetallePage, { campania: campania });
    }

    onBugReport() {
        this.reporter.report();
    }

}
