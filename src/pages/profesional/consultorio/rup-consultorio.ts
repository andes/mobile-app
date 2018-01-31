import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { AuthProvider } from '../../../providers/auth/auth';
import { RupProvider } from '../../../providers/rup';
import { ToastProvider } from '../../../providers/toast';
import { RupAdjuntarPage } from '../rup-adjuntar/rup-adjuntar';

@Component({
  selector: 'page-rup-consultorio',
  templateUrl: 'rup-consultorio.html'
})
export class RupConsultorioPage {

  private onResumeSubscription: Subscription;
  private solicitudes: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public rup: RupProvider,
    public authProvider: AuthProvider,
    public platform: Platform,
    public toast: ToastProvider) {

    this.onResumeSubscription = platform.resume.subscribe(() => {
        this.buscarSolicitudes();
    });

    this.buscarSolicitudes();
  }

  ngOnDestroy() {
    this.onResumeSubscription.unsubscribe();
  }

  buscarSolicitudes () {
    this.rup.get({  }).then((data: any) => {
        this.solicitudes = data;
    });
  }

  onClick(solicitud) {
      this.navCtrl.push(RupAdjuntarPage, { id: solicitud._id });
  }

}
