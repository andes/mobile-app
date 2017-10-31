import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers

import { AuthProvider } from '../../../providers/auth/auth';
import { RupProvider } from '../../../providers/rup';

@Component({
  selector: 'page-rup-adjuntar',
  templateUrl: 'rup-adjuntar.html'
})
export class RupAdjuntarPage {
  mostrarMenu: boolean = true;
  agendas: any[] = null;

  private onResumeSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public rup: RupProvider,
    public authProvider: AuthProvider,
    public platform: Platform) {

    this.onResumeSubscription = platform.resume.subscribe(() => {

    });

    let notification = this.navParams.get('notification');
    console.log(notification);
  }

  ngOnDestroy() {
    this.onResumeSubscription.unsubscribe();
  }

}
