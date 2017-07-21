import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
// import { TipoPrestacionService } from '../../services/tipoPrestacion-service';
import { TurnosProvider } from '../../providers/turnos';
import { DeviceProvider } from '../../providers/auth/device';
import { Subscription } from 'rxjs';

import * as moment from 'moment/moment';

@Component({
  selector: 'page-turnos',
  templateUrl: 'turnos.html'
})
export class TurnosPage {
  mostrarMenu: boolean = true;
  selectOptions: any = {};

  tipoPrestacion: any[];
  turnos: any[] = null;

  private onResumeSubscription: Subscription;

  ngOnDestroy() {
    // always unsubscribe your subscriptions to prevent leaks
    this.onResumeSubscription.unsubscribe();
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public turnosProvider: TurnosProvider,
    public devices: DeviceProvider,
    public platform: Platform) {


    this.getTurnos();
    this.onResumeSubscription = platform.resume.subscribe(() => {
      console.log('onResume');
      this.getTurnos();
    });
  }

  getTurnos() {
    var params = { horaInicio: moment(new Date()).format() };
    this.turnosProvider.get(params).then((data: any[]) => {
      //data.forEach(item => item.horaInicio = moment(item.horaInicio).format('DD/MM/YYYY HH:MM'));
      this.turnos = data;
    });
  }

  onCancelTurno($event) {
    this.turnos = this.turnos.filter(item => item._id != $event._id);
  }


}
