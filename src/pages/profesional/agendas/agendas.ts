import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { AgendasProvider } from '../../../providers/agendas';
import { AuthProvider } from '../../../providers/auth/auth';

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
    public agendasProvider: AgendasProvider,
    public authProvider: AuthProvider,
    public platform: Platform) {

    this.onResumeSubscription = platform.resume.subscribe(() => {
      this.getAgendas();
    });

    this.getAgendas();
  }

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }

  getAgendas() {
    let data = {
      estado: 'publicada',
      idProfesional: this.authProvider.user.profesionalId,
      fechaDesde: moment(new Date()).toISOString()
    };

    this.agendasProvider.get(data).then((data: any[]) => {
      this.agendas = data;
    })
  }

  onCancelAgenda($event) {
    console.log('onCancelAgenda');
  }

}
