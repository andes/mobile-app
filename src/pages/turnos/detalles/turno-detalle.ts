import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// pages
import { TurnosPage } from '../turnos';
import { HomePage } from '../../home/home';
import { MapTurnosPage } from '../mapa/mapa';

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
    private turnoAsignado;
    @Output() onCancelEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        public navCtrl: NavController,
        public turnosProvider: TurnosProvider,
        public navParams: NavParams,
        private toast: ToastProvider,
        public alertCtrl: AlertController,
        public platform: Platform) {
        this.turno = this.navParams.get('turno');
        this.turnoAsignado = this.turno.estado === 'asignado' ? true : false;
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
            this.turnosProvider.cancelarTurno(params).then((resultado) => {
                this.onCancelEvent.emit(this.turno);
                this.navCtrl.push(TurnosPage).then(() => {
                    this.toast.success('El turno fue liberado correctamente');
                    this.navCtrl.setRoot(HomePage);
                    this.navCtrl.popToRoot();
                });
            }).catch((err2) => {
                this.toast.danger('Ocurrió un error al cancelar el turno, reintente más tarde');
                this.navCtrl.push(HomePage);
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
        return this.turno.organizacion.nombre
    }

    mapTurno() {
        let idOrganizacion = this.turno.organizacion._id
        this.turnosProvider.getUbicacionTurno(idOrganizacion).then((data: any) => {

            let centro: any = {
                nombre: data._doc.nombre,
                direccion: data.domicilio.direccion,
                location: {
                    latitud: data.coordenadasDeMapa.latitud,
                    longitud: data.coordenadasDeMapa.longitud
                }
            }
            this.navCtrl.push(MapTurnosPage, { centro: centro });
        })
    }



}
