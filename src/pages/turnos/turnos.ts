import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, MenuController } from 'ionic-angular';
import * as moment from 'moment/moment';
import { Storage } from '@ionic/storage';

import { TurnosProvider } from '../../providers/turnos';
import { DeviceProvider } from '../../providers/auth/device';
import { Subscription } from 'rxjs';
import { ErrorReporterProvider } from '../../providers/errorReporter';


// Components
import { TurnosDetallePage } from './detalles/turno-detalle';
import { TurnosPrestacionesPage } from './prestaciones/turnos-prestaciones';
import { HistorialTurnosPage } from './historial/historial-turnos';

@Component({
  selector: 'page-turnos',
  templateUrl: 'turnos.html'
})
export class TurnosPage implements OnDestroy {
  selectOptions: any = {};
  familiar: any;
  tipoPrestacion: any[];
  turnos: any[] = null;
  habilitarTurnos = false;

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
    public alertCtrl: AlertController,
    public reporter: ErrorReporterProvider,
    public menuCtrl: MenuController,
    public platform: Platform,
    public storage: Storage
  ) {
    this.menuCtrl.enable(true, 'historial');
    this.storage.get('familiar').then((value) => {
      if (value) {
        this.familiar = value;
      }
      // this.getTurnos();
      this.onResumeSubscription = platform.resume.subscribe(() => {
        this.getTurnos();
      });
      this.getTurnos();
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'historial');
  }

  getTurnos() {
    let params = { horaInicio: moment(new Date()).format(), familiar: this.familiar };
    this.turnosProvider.get(params).then((data: any[]) => {
      this.turnos = data;
      this.habilitarTurnos = true;
    }).catch(() => {
      // console.log('Error en la api');
    });
  }

  onCancelTurno($event) {
    this.turnos = this.turnos.filter(item => item._id !== $event._id);
  }

  onClickEvent($event) {
    this.navCtrl.push(TurnosDetallePage, { turno: $event });
  }

  buscarPrestacion() {
    this.navCtrl.push(TurnosPrestacionesPage, { turnos: this.turnos });
  }

  // terminar esta parte!
  showConfirm(title, message) {
    return new Promise((resolve, reject) => {
      let confirm = this.alertCtrl.create({
        title: title,
        message: message,
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
              reject();
            }
          },
          {
            text: 'Aceptar',
            handler: () => {
              resolve();
            }
          }
        ]
      });
      confirm.present();
    });

  }
  onBugReport() {
    this.reporter.report();
  }

  abrirHistorial() {
    this.navCtrl.push(HistorialTurnosPage);
  }

}
