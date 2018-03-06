import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProfilePacientePage } from './profile-paciente';
import { DondeVivoDondeTrabajoPage } from './donde-vivo-donde-trabajo/donde-vivo-donde-trabajo';
import { ProfileContactosPage } from './profile-contactos';
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

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        //
    }

    tab1Root: any = ProfilePacientePage;
    tab2Root: any = DondeVivoDondeTrabajoPage;
    tab3Root: any = ProfileContactosPage;
}
