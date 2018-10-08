import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import * as moment from 'moment/moment';

import { TurnosProvider } from '../../providers/turnos';
import { DeviceProvider } from '../../providers/auth/device';
import { Subscription } from 'rxjs';
import { ErrorReporterProvider } from '../../providers/errorReporter';


// Components
import { TurnosDetallePage } from './detalles/turno-detalle';
import { TurnosBuscarPage } from './buscar/turnos-buscar';


@Component({
  selector: 'page-turnos',
  templateUrl: 'turnos.html'
})
export class TurnosPage implements OnDestroy {
  selectOptions: any = {};

  tipoPrestacion: any[];
  turnos: any[] = null;
  noTieneTurnoOdonto = true;

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
    public platform: Platform) {

    // this.getTurnos();
    // this.onResumeSubscription = platform.resume.subscribe(() => {
    //   this.getTurnos();
    // });
  }

  ionViewDidLoad() {
    this.getTurnos();
    this.reporter.alert();
  }

  getTurnos() {
    let params = { horaInicio: moment(new Date()).format() };
    this.turnosProvider.get(params).then((data: any[]) => {
      this.turnos = data;
      this.turnos.forEach(turno => {
        // Verificamos que no tenga turnos de odontología, luego esto deberá ser verificado de forma más genérica para limitar la cantidad de turnos a solicitar.
        if (turno.tipoPrestacion.conceptId === '34043003') {
          return this.noTieneTurnoOdonto = false
        }
      });
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

  solicitarTurno() {
    this.showConfirm('La solicitud de turnos está funcionando como prueba piloto sólo para turnos de Odontología en Neuquén Capital. En breve se irán sumando nuevas prestaciones, ¿Desea continuar?', '').then(() => {
      this.navCtrl.push(TurnosBuscarPage);
    }).catch(() => { });
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

}
