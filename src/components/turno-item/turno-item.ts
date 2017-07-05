import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as moment from 'moment/moment';

import { DatePicker } from '@ionic-native/date-picker';
import { AuthProvider } from '../../providers/auth/auth';
import { RegistroUserDataPage } from '../registro/user-data/user-data';
import { TurnosPage } from '../turnos/turnos';
import { TurnosProvider } from '../../providers/turnos';


@Component({
  selector: 'turno-item',
  templateUrl: 'turno-item.html',
})

export class TurnoItemComponent {
  @Input() turno: any;
  @Output() onCancelEvent: EventEmitter<any> = new EventEmitter();
  private expand: Boolean = false;
  constructor(public turnosProvider: TurnosProvider, public alertCtrl: AlertController) {
    console.log(this.turno);
  }

  profesionalName() {
    return this.turno.profesionales[0].apellido + ' ' + this.turno.profesionales[0].nombre;
  }

  turnoFecha() {
    return moment(this.turno.horaInicio).format('DD/MM/YYYY');
  }

  turnoHora() {
    return moment(this.turno.horaInicio).format('HH:MM');
  }

  tootleExpand() {
    this.expand = !this.expand;
  }

  onCancel($event) {
    $event.stopPropagation();
    this.showConfirm('¿Desea cancelar el turno selecionado?', '').then(() => {
      let params = {
        turno_id: this.turno._id,
        agenda_id: this.turno.agenda_id
      }
      // this.turnosProvider.cancelarTurno(params).then(() => {
      this.onCancelEvent.emit(this.turno);
      // this.turnos = this.turnos.filter(item => item._id != turno._id);
      // });
    }).catch(() => { });

  }

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

}
