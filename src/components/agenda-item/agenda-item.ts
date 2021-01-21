import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment/moment';
import { ToastProvider } from '../../providers/toast';
import { AuthProvider } from '../../providers/auth/auth';
import { AgendasProvider } from '../../providers/agendas';

@Component({
    selector: 'app-agenda-item',
    templateUrl: 'agenda-item.html',
})

export class AgendaItemComponent implements OnInit {
    @Input() agenda: any;
    @Output() cancelEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        private alertCtrl: AlertController,
        private authProvider: AuthProvider,
        private agendasProvider: AgendasProvider,
        private toast: ToastProvider) {
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
        return this.agenda.avisos && this.agenda.avisos.findIndex(item => item.profesionalId === this.authProvider.user.profesionalId) >= 0;
    }

    avisoEstado() {
        if (this.agenda.avisos) {
            const aviso = this.agenda.avisos.find(item => item.profesionalId === this.authProvider.user.profesionalId);
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
            const params = {
                op: 'avisos',
                estado: 'suspende',
                profesionalId: this.authProvider.user.profesionalId,
            };
            this.agendasProvider.patch(this.agenda.id, params).subscribe((data: any) => {
                this.agenda.avisos = data.avisos;
                this.toast.success('SU AGENDA FUE SUSPENDIDA');
            });
            // .catch(() => {
            //     this.toast.danger('VUELVALO A INTENTAR');
            // });
        }).catch(() => { });

    }

    onConfirm() {
        const params = {
            op: 'avisos',
            estado: 'confirma',
            profesionalId: this.authProvider.user.profesionalId,
        };
        this.agendasProvider.patch(this.agenda.id, params).subscribe((data: any) => {
            this.agenda.avisos = data.avisos;
            this.toast.success('SU AGENDA FUE CONFIRMADA');
        });
        // .catch(() => {
        //     this.toast.danger('VUELVALO A INTENTAR');
        // });
    }

    async showConfirm(title, message) {
        const confirm = await this.alertCtrl.create({
            header: title,
            message,
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        // reject();
                    }
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        // resolve();
                    }
                }
            ]
        });
        await confirm.present();

    }

    onMenuItemClick(action) {
        if (action === 'cancelar') {
            this.onCancel();
        } else if (action === 'confirmar') {
            this.onConfirm();
        }
    }

    // onMenuClick($event) {
    //     $event.stopPropagation();
    //     const self = this;
    //     const data = {
    //         callback: function (action) {
    //             self.onMenuItemClick(action);
    //         }
    //     };
    //     const popover = this.popoverCtrl.create(DropdownAgendaItemComponent, data);
    //     popover.present({
    //         ev: $event
    //     });
    // }
}
