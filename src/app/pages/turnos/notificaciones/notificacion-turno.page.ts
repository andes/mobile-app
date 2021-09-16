import { ConstanteProvider } from './../../../../providers/constantes';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { AgendasProvider } from 'src/providers/agendas';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';
import { GeoProvider } from 'src/providers/geo-provider';
import { DeviceProvider } from 'src/providers/auth/device';

@Component({
    selector: 'app-notificacion-turno',
    templateUrl: './notificacion-turno.page.html'
})

export class NotificacionTurnoPage implements OnDestroy, OnInit {
    turno: any;
    inProgress = false;
    organizacion;
    GPSAvailable: boolean;
    hayTurnos = false;
    tituloPagina: string;
    action: any;
    subtituloPagina: string;
    userLocation: any;
    constructor(
        public gMaps: GeoProvider,
        private alertController: AlertController,
        private route: ActivatedRoute,
        private router: Router,
        private constantes: ConstanteProvider,
        private agendasService: AgendasProvider,
        public checker: CheckerGpsProvider,
        private device: DeviceProvider,
        private platform: Platform,
    ) { }

    ngOnDestroy(): void {


    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.turno = JSON.parse(params.turno);
            this.organizacion = JSON.parse(params.organizacion);
            this.action = params.action;
            this.inProgress = false;

            this.configurarPagina();

        });
        if (this.platform.is('android') || this.platform.is('ios')) {
            // Tiene capacidad GPS?
            this.checker.isGPSAvailable().then(available => {
                this.GPSAvailable = available;
                if (this.GPSAvailable) {
                    this.getUbicacion();
                }
            });

        }

    }
    configurarPagina() {
        if (this.action === 'suspender-turno') {
            this.tituloPagina = 'Turno suspendido';
            this.subtituloPagina = 'Aviso de suspensión de turno';
        }
    }

    ionViewDidEnter() {
        this.agendasService.getAgendasDisponibles({ userLocation: JSON.stringify(this.userLocation), idPaciente: this.turno.paciente.id })
            .subscribe((data: any[]) => {
                if (data) {
                    if (data.length === 0) {
                        this.hayTurnos = false;
                    } else {
                        this.hayTurnos = true;
                    }
                }
            });
    }

    private getUbicacion() {
        if (this.gMaps.actualPosition) {
            this.userLocation = { lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude };
        } else {
            this.gMaps.getGeolocation().then(position => {
                if (position) {
                    this.userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                }
            });
        }
    }

    htmlProfesionales() {
        if (this.turno.profesionales && this.turno.profesionales.length) {

            let profHTML;
            for (let profesional of this.turno.profesionales) {
                profHTML = `${profesional.apellido}, ${profesional.nombre}<br>`;
            }

            return `<ion-item color="secondary">
                <ion-label>
                    <h2>Equipo de Salud</h2>
                    <p>${profHTML}</p>
                </ion-label>
            </ion-item>`
        } else {
            return '';
        }
    }

    get turnoSuspendido() {
        return this.action === 'suspender-turno';
    }

    get motivoSuspension() {
        return this.constantes.getMotivoSuspension(this.turno.motivoSuspension);
    }

    async verInformacionTurno(turno, organizacion) {

        const alert = await this.alertController.create({
            header: 'Turno suspendido',
            message: `
                <ion-list>
                    <ion-list-header>
                        <ion-label>
                            <b class="ion-text-capitalize">${turno.tipoPrestacion}</b>
                            <p>${moment(turno.horaInicio).format('d/MM/yyyy HH:mm')} horas</p>
                        </ion-label>
                    </ion-list-header>
                    </ion-item>
                    ${this.htmlProfesionales()}
                    <ion-item color="secondary">
                        <ion-label>
                            <h2>Centro de Atención</h2>
                            <p>${organizacion.nombre}</p>
                        </ion-label>
                    </ion-item>
                </ion-list>
                `,
            buttons: [{
                text: 'Aceptar',
                handler: () => {
                    console.log('Confirm Okay');
                }
            }
            ]
        });

        await alert.present();
    }

    irATurnos() {
        this.router.navigate(['/turnos'], { queryParams: { idPaciente: this.turno.paciente.id } });
    }

    llamarCentroAtencion(numero) {
        this.device.llamarPorTelefono(numero);
    }

}
