import { Component, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// pages
import { TurnosPage } from '../turnos';

// providers
import { TurnosProvider } from '../../../providers/turnos';
import { ToastProvider } from '../../../providers/toast';



@Component({
    selector: 'page-turno-detalle',
    templateUrl: 'turno-detalle.html'
})
export class TurnosDetallePage {

    private onResumeSubscription: Subscription;
    private turno: any;
    @Output() onCancelEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        public navCtrl: NavController,
        public turnosProvider: TurnosProvider,
        public navParams: NavParams,
        private toast: ToastProvider,
        public alertCtrl: AlertController,
        public platform: Platform) {
        this.turno = this.navParams.get('turno');
    }

    profesionalName() {

        return this.turno.profesionales[0].apellido + ' ' + this.turno.profesionales[0].nombre;
    }

    turnoFecha() {
        return moment(this.turno.horaInicio).format('DD/MM/YY');
    }

    turnoHora() {
        return moment(this.turno.horaInicio).format('HH:mm');
    }

    isAsignado() {
        return this.turno.estado === 'asignado' ? true : false;
    }


    cancelarTurno() {
        this.showConfirm('¿Seguro desea cancelar este turno?', '').then(() => {
            let params = {
                turno_id: this.turno._id,
                agenda_id: this.turno.agenda_id,
                bloque_id: this.turno.bloque_id
            }

            this.turnosProvider.cancelarTurno(params).then(() => {
                this.onCancelEvent.emit(this.turno);
                this.navCtrl.push(TurnosPage);
            });
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

    efector() {
        // console.log('turno: ', this.turno.organizacion);
        return this.turno.organizacion.nombre
    }
    ionViewDidLoad() {
    }

}
