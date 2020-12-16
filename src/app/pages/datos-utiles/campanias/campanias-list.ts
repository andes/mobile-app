import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
// Pages
import { CampaniaDetallePage } from '../campanias/detalle/campania-detalle';
import * as moment from 'moment/moment';
// Providers
import { ErrorReporterProvider } from '../../../../providers/errorReporter';
import { CampaniasProvider } from '../../../../providers/campanias';


@Component({
    selector: 'app-campanias-list',
    templateUrl: 'campanias-list.html'
})
export class CampaniasListPage {
    campanias = [];
    loading: any;
    constructor(
        public navCtrl: NavController,
        public loadingController: LoadingController,
        private campaniasProvider: CampaniasProvider,
        public reporter: ErrorReporterProvider,
    ) {
        // this.cargando();
        this.getCampanias();
        moment.locale('es');
    }

    ionViewDidLoad() {
    }

    getCampanias() {
        this.campaniasProvider.get().then(async (data: any[]) => {
            await this.loading.dismiss();
            this.campanias = data;
        }).catch((err => {
            // console.log('errorrrrr');
        }));
    }

    periodo(campania) {
        return ('Desde el ' + moment(campania.vigencia.desde).format('DD [de] MMMM') + ' al ' + moment(campania.vigencia.hasta).format('DD [de] MMMM [del] YYYY'))
    }

    verCampania(campania) {
        // this.navCtrl.push(CampaniaDetallePage, { campania: campania });
    }

    onBugReport() {
        this.reporter.report();
    }

    async cargando() {
        this.loading = await this.loadingController.create({
            message: 'Cargando datos de Campañas...',
            translucent: true,
            spinner: 'circles'
        });
        await this.loading.present();
    }

}
