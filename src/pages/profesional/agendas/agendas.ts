import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { DeviceProvider } from '../../../providers/auth/device';

@Component({
  selector: 'page-agendas',
  templateUrl: 'agendas.html'
})
export class AgendasPage {
  mostrarMenu: boolean = true;
  agendas: any[] = null;

  private onResumeSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public devices: DeviceProvider,
    platform: Platform) {

    this.onResumeSubscription = platform.resume.subscribe(() => {

    });
  }

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }


}
