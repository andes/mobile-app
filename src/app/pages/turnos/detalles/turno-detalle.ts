import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';

import * as moment from 'moment/moment';

// pages
// import { TurnosPage } from '../turnos';
// import { HomePage } from '../../home/home';
// import { MapTurnosPage } from '../mapa/mapa';

// providers
import { TurnosProvider } from '../../../../providers/turnos';
import { ToastProvider } from '../../../../providers/toast';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-turno-detalle',
    templateUrl: 'turno-detalle.html'
})
export class TurnosDetallePage implements OnInit{

    private onResumeSubscription: Subscription;
    private turno: any;
    private turnoAsignado;
    familiar: any;
    onCancelEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        public navCtrl: NavController,
        public route: ActivatedRoute,
        public router: Router,
        public turnosProvider: TurnosProvider,
        public navParams: NavParams,
        private toast: ToastProvider,
        public alertCtrl: AlertController,
        public platform: Platform,
        public storage: Storage) {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
        });
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.turno = params.turno;
            this.turno = JSON.parse(this.turno);
            this.turnoAsignado = this.turno.estado === 'asignado' ? true : false;
        });
    }


    profesionalName() {
        if (this.turno.profesionales.length > 0) {
            return this.turno.profesionales[0].apellido + ' ' + this.turno.profesionales[0].nombre;
        } else {
            return 'Sin profesional';
        }
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
        this.showConfirm('Cancelar', '¿Seguro desea cancelar este turno?').then(() => {
            const params = {
                turno_id: this.turno._id,
                agenda_id: this.turno.agenda_id,
                bloque_id: this.turno.bloque_id,
                familiar: this.familiar
            };
            this.turnosProvider.cancelarTurno(params).subscribe((resultado) => {
                this.onCancelEvent.emit(this.turno);
                this.toast.success('El turno fue liberado correctamente');
                this.router.navigate(['/home']);

            }, (error) => {
                this.toast.danger('Ocurrió un error al cancelar el turno, reintente más tarde');
                this.router.navigate(['home']);
            });
        }).catch(() => { });
    }

    showConfirm(title, message) {
        return new Promise(async (resolve, reject) => {
            const confirm = await this.alertCtrl.create({
                header: title,
                message,
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
        return this.turno.organizacion.nombre;
    }

    mapTurno() {
        const idOrganizacion = this.turno.organizacion._id;
        this.turnosProvider.getUbicacionTurno(idOrganizacion).then((data: any) => {
            const centro: any = {
                nombre: data._doc.nombre,
                domicilio: {
                    direccion: data._doc.direccion.valor
                },
                location: {
                    latitud: data.coordenadasDeMapa.latitud,
                    longitud: data.coordenadasDeMapa.longitud
                }
            };
            // this.navCtrl.push(MapTurnosPage, { centro: centro });
        });
    }



}
