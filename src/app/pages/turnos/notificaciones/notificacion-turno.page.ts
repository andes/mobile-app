import { ConstanteProvider } from './../../../../providers/constantes';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AgendasProvider } from 'src/providers/agendas';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';
import { GeoProvider } from 'src/providers/library-services/geo-provider';
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
    action: string;
    tituloPagina = 'Turno';
    subtituloPagina = 'Detalles del turno';
    motivoSuspension: string;
    turnoSuspendido = false;
    tituloAccion: any;
    userLocation: any;
    constructor(
        public gMaps: GeoProvider,
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
        this.motivoSuspension= this.verMotivoSuspension();
        this.turnoSuspendido = this.verTurnoSuspendido();

    }
    configurarPagina() {
        if (this.action === 'suspender-turno') {
            this.tituloPagina = 'Turno suspendido';
            this.subtituloPagina = 'Aviso de suspensión de turno';
            this.tituloAccion = 'Si preferís, comunicate por teléfono a los siguientes números para obtener un turno';
        }
    }

    getAgendas() {
        this.agendasService.getAgendasDisponibles({
            userLocation: JSON.stringify(this.userLocation),
            idPaciente: this.turno.paciente.id
        }).subscribe((data: any[]) => {
            if (data) {
                if (data.length === 0) {
                    this.hayTurnos = false;
                } else {
                    this.hayTurnos = true;
                }
            }
        });
    }

    private async getUbicacion() {
        if (this.gMaps.actualPosition) {
            this.userLocation = { lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude };
        } else {
            const position = await this.gMaps.getGeolocation();
            if (position) {
                this.userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
            }
        }
        this.getAgendas();
    }


    verTurnoSuspendido() {
        return this.action === 'suspender-turno';
    }

    verMotivoSuspension() {
        return this.constantes.getMotivoSuspension(this.turno.motivoSuspension);
    }

    irATurnos() {
        this.router.navigate(['/turnos'], { queryParams: { idPaciente: this.turno.paciente.id } });
    }

    llamarCentroAtencion(numero) {
        this.device.llamarPorTelefono(numero);
    }

}
