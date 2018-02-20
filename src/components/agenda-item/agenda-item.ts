import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, AlertController, PopoverController } from 'ionic-angular';
import * as moment from 'moment/moment';
import { ToastProvider } from '../../providers/toast';
import { AuthProvider } from '../../providers/auth/auth';
import { AgendasProvider } from '../../providers/agendas';
import { DropdownAgendaItem } from './dropdown-agenda-item';

@Component({
  selector: 'agenda-item',
  templateUrl: 'agenda-item.html',
})

export class AgendaItemComponent {
  @Input() agenda: any;
  @Output() onCancelEvent: EventEmitter<any> = new EventEmitter();
  constructor(
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public agendasProvider: AgendasProvider,
    public toast: ToastProvider) {
    //
  }

  ngOnInit() {
    moment.locale('es');
  }

  fecha() {
    return moment(this.agenda.horaInicio).format('DD [de] MMMM');
  }

  hora() {
    return moment(this.agenda.horaInicio).format('HH:mm');
  }

  hayAviso() {
    return this.agenda.avisos && this.agenda.avisos.findIndex(item => item.profesionalId == this.authProvider.user.profesionalId) >= 0;
  }

  avisoEstado() {
    if (this.agenda.avisos) {
      let aviso = this.agenda.avisos.find(item => item.profesionalId == this.authProvider.user.profesionalId);
      if (aviso) {
        return aviso.estado;
      }
    }
    return null;
  }

  isToday() {
    return moment(new Date()).format('DD/MM/YYYY') === moment(this.agenda.horaInicio).format('DD/MM/YYYY');
  }

  onCancel() {
    this.showConfirm('¿Desea informar la suspensión de la agenda?', '').then(() => {
      let params = {
        op: 'avisos',
        estado: 'suspende',
        profesionalId: this.authProvider.user.profesionalId,
      };
      this.agendasProvider.patch(this.agenda.id, params).then((data: any) => {
        this.agenda.avisos = data.avisos;
        this.toast.success('SU AGENDA FUE SUSPENDIDA');
      }).catch(() => {
        this.toast.danger('VUELVALO A INTENTAR');
      });
    }).catch(() => { });

  }

  onConfirm() {
    let params = {
      op: 'avisos',
      estado: 'confirma',
      profesionalId: this.authProvider.user.profesionalId,
    };
    this.agendasProvider.patch(this.agenda.id, params).then((data: any) => {
      this.agenda.avisos = data.avisos;
      this.toast.success('SU AGENDA FUE CONFIRMADA');
    }).catch(() => {
      this.toast.danger('VUELVALO A INTENTAR');
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

  onMenuItemClick(action) {
    if (action == 'cancelar') {
      this.onCancel();
    } else if (action == 'confirmar') {
      this.onConfirm();
    }
  }

  onMenuClick($event) {
    $event.stopPropagation();
    const self = this;
    let data = {
      callback: function (action) {
        self.onMenuItemClick(action);
      }
    }
    let popover = this.popoverCtrl.create(DropdownAgendaItem, data);
    popover.present({
      ev: $event
    });
  }
}
