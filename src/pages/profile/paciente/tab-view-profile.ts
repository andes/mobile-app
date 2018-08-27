import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';

import { ProfilePacientePage } from './profile-paciente';
import { DondeVivoDondeTrabajoPage } from './donde-vivo-donde-trabajo/donde-vivo-donde-trabajo';
import { ProfileContactosPage } from './profile-contactos';
import { ErrorReporterProvider } from '../../../providers/errorReporter';
/**
 * Generated class for the CentrosSaludPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'tab-view-profle',
    templateUrl: 'tab-view-profile.html',
})
export class TabViewProfilePage {
    @ViewChild('tabs') tabRef: Tabs;
    subtitle = '';

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public reporter: ErrorReporterProvider) {
    }

    ionViewDidLoad() {
        this.reporter.alert();
    }

    tab1Root: any = ProfilePacientePage;
    tab2Root: any = DondeVivoDondeTrabajoPage;
    tab3Root: any = ProfileContactosPage;

    onBugReport() {
        this.reporter.report();
    }

    onTabChange () {
        switch (this.tabRef.getSelected().index) {
            case 0:
                this.subtitle = 'Personales';
                break;
            case 1:
                this.subtitle = 'Dirección';
                break;
            case 2:
                this.subtitle = 'Contacto';
                break;
        }
    }
}
