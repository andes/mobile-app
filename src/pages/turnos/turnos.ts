import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
// import { TipoPrestacionService } from '../../services/tipoPrestacion-service';
import { TurnosProvider } from '../../providers/turnos';
import { DeviceProvider } from '../../providers/auth/device';
import { Subscription } from 'rxjs';

import * as moment from 'moment/moment';
import { TurnosDetallePage } from './detalles/turno-detalle';

@Component({
  selector: 'page-turnos',
  templateUrl: 'turnos.html'
})
export class TurnosPage {
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
      this.getTurnos();
    });
  }

  getTurnos() {
    let params = { horaInicio: moment(new Date()).format() };
    this.turnosProvider.get(params).then((data: any[]) => {
      this.turnos = data;
    }).catch(() => {
      // console.log('Error en la api');
    });
  }

  onCancelTurno($event) {
    this.turnos = this.turnos.filter(item => item._id !== $event._id);
  }

  onClickEvent($event) {
      this.navCtrl.push(TurnosDetallePage, {turno: $event});
  }


}
