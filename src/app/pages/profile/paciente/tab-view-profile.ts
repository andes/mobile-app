import { Component, } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

import { DondeVivoDondeTrabajoPage } from './donde-vivo-donde-trabajo/donde-vivo-donde-trabajo';
import { ProfileContactosPage } from './profile-contactos';
import { ErrorReporterProvider } from 'src/providers/errorReporter';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tab-view-profle',
    templateUrl: 'tab-view-profile.html',
})
export class TabViewProfilePage {
    // @ViewChild('tabs') tabRef: Tabs;
    subtitle = '';

    constructor(
        private router: Router,
        public navCtrl: NavController,
        public navParams: NavParams,
        public reporter: ErrorReporterProvider) {
    }

    ionViewDidLoad() {
        this.reporter.alert();
    }

    profile(){
        console.log('navego a profile');
        this.router.navigate(['profile/profile-paciente']);
    }

    // tab1Root: any = ProfilePacientePage;
    // tab2Root: any = DondeVivoDondeTrabajoPage;
    // tab3Root: any = ProfileContactosPage;

    onBugReport() {
        this.reporter.report();
    }

    onTabChange() {
        // switch (this.tabRef.getSelected().index) {
        //     case 0:
        //         this.subtitle = 'Personales';
        //         break;
        //     case 1:
        //         this.subtitle = 'Dirección';
        //         break;
        //     case 2:
        //         this.subtitle = 'Contacto';
        //         break;
        // }
    }
}
