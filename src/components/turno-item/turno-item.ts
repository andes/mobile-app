import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastController, NavController, AlertController, PopoverController } from 'ionic-angular';
import * as moment from 'moment/moment';

// providers
import { TurnosProvider } from '../../providers/turnos';
import { ToastProvider } from '../../providers/toast';

// pages
import { DropdownTurnoItem } from './dropdown-turno-item';
import { FaqPage } from 'pages/datos-utiles/faq/faq';
import { TurnosDetallePage } from 'pages/turnos/detalles/turno-detalle';

@Component({
  selector: 'turno-item',
  templateUrl: 'turno-item.html',
})

export class TurnoItemComponent {
  @Input() turno: any;
  @Output() onCancelEvent: EventEmitter<any> = new EventEmitter();
  @Output() onClickEvent: EventEmitter<any> = new EventEmitter();


  private expand: Boolean = false;
  constructor(
    private toastCtrl: ToastController,
    private toast: ToastProvider,
    public popoverCtrl: PopoverController,
    public turnosProvider: TurnosProvider,
    public alertCtrl: AlertController,
    public navCtrl: NavController) {
    //
  }

  ngOnInit() {
    moment.locale('es');
    if (this.turno.reasignado_anterior) {
      this.turno.reasignado_anterior.fecha = moment(this.turno.reasignado_anterior.horaInicio);
    }
  }

  profesionalName() {

    return this.turno.profesionales[0].apellido + ' ' + this.turno.profesionales[0].nombre;
  }

  turnoFecha() {
    return moment(this.turno.horaInicio).format('DD [de] MMMM');
  }

  turnoHora() {
    return moment(this.turno.horaInicio).format('HH:mm');
  }

  turnoConfirmado() {
    if (this.turno.confirmedAt != null)
      return 'Confirmado';
  }

  tootleExpand() {
    this.expand = !this.expand;
  }

  isToday() {
    return moment(new Date()).format('DD/MM/YYYY') === moment(this.turno.horaInicio).format('DD/MM/YYYY');
  }

  isSuspendido() {
    return this.turno.estado == 'suspendido' || this.turno.agenda_estado == 'suspendida';
  }

  isReasignado() {
    return this.turno.reasignado_anterior;
  }

  turnoConfirmadoAsistencia() {
    return this.turno.asistencia && this.turno.asistencia == 'asistio';
  }

  onCancel($event) {
    //$event.stopPropagation();
    this.showConfirm('¿Desea cancelar el turno selecionado?', '').then(() => {
      let params = {
        turno_id: this.turno._id,
        agenda_id: this.turno.agenda_id,
        bloque_id: this.turno.bloque_id
      }
      this.turnosProvider.cancelarTurno(params).then(() => {
        this.onCancelEvent.emit(this.turno);
      });
    }).catch(() => { });

  }

  onTurnoClick () {
    this.onClickEvent.emit(this.turno);
  }

  onConfirm() {
    let params = {
      turno_id: this.turno._id,
      agenda_id: this.turno.agenda_id,
      bloque_id: this.turno.bloque_id
    };
    this.turnosProvider.confirmarTurno(params).then(() => {
      this.turno.confirmedAt = new Date();
      this.toast.success('Turno confirmado con exito!');
    }).catch(() => {
      this.toast.danger('No se pudo confirmar el turno. Vuelva a intentar.');
    });
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

  onConfirmAsistencia() {
    let params = {
      turno_id: this.turno._id,
      agenda_id: this.turno.agenda_id,
      bloque_id: this.turno.bloque_id
    };
    this.turnosProvider.confirmarAsistenciaTurno(params).then(() => {
      this.turno.asistencia = 'asistio';
      this.toast.success('Asistencia al turno confirmada con exito!');
    }).catch(() => {
      this.toast.danger('No se pudo confirmar la asistencia del turno. Vuelva a intentar.');
    });
  }

  showConfirmAsistencia(title, message) {
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

  onMenuItemClick(action) {
    console.log(action);
    if (action == 'cancelar') {
      this.onCancel(null);
    } else if (action == 'confirmar') {
      this.onConfirm();
    } else if (action == 'asistencia') {
      this.onConfirmAsistencia();
    }
  }

  onMenuClick($event) {
    $event.stopPropagation();
    const self = this;
    let data = {
      callback: function (action) {
        self.onMenuItemClick(action);
      },
      showConfirm: !this.turno.confirmedAt,
      showConfirmAsistencia: !this.turno.asistencia
    }
    let popover = this.popoverCtrl.create(DropdownTurnoItem, data);
    popover.present({
      ev: $event
    });
  }
}