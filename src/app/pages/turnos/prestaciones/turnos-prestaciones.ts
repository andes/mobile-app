import { Observable, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GeoProvider } from 'src/providers/geo-provider';
import { AgendasProvider } from 'src/providers/agendas';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TurnosProvider } from 'src/providers/turnos';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';

@Component({
    selector: 'app-turnos-prestaciones',
    templateUrl: 'turnos-prestaciones.html'
})

export class TurnosPrestacionesPage implements OnInit {
    public turnosActuales: any = [];
    public prestacionesTurneables: any = [];
    public loader = true;
    public familiar = false;
    public organizacionAgendas;
    public hayTurnos = false;
    GPSAvailable = false;
    private idPaciente;

    constructor(
        public gMaps: GeoProvider,
        private agendasService: AgendasProvider,
        private storage: Storage,
        private turnosProvider: TurnosProvider,
        private router: Router,
        private route: ActivatedRoute,
        private platform: Platform,
        public checker: CheckerGpsProvider) {
    }

    get loading() {
        return this.loader && (!this.hayTurnos && this.GPSAvailable);
    }

    get sinTurnos() {
        return this.GPSAvailable && !this.loader && !this.hayTurnos;
    }

    get sinGPS() {
        return !this.loader && (!this.GPSAvailable && !this.hayTurnos);
    }

    // Camino feliz?
    get hayTurnosYGPS() {
        return !this.loader && (this.hayTurnos && this.GPSAvailable);
    }

    ngOnInit() {
        this.loader = true;
        // Es un dispositivo?
        if (this.platform.is('android') || this.platform.is('ios')) {
            // Tiene capacidad GPS?
            this.checker.isGPSAvailable().then(available => {
                this.GPSAvailable = available;
            });
        }
        this.route.queryParams.subscribe(params => {
            this.idPaciente = params.idPaciente;
        });
    }

    ionViewWillEnter() {
        // Reiniciamos controles
        this.loader = true;
        this.turnosActuales = [];
        this.hayTurnos = false;

        // Es familiar?
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = true;
            }
        });

        // Cargamos turnos actuales
        this.turnosProvider.storage.get('turnos').then((turnos) => {
            this.turnosActuales = turnos.turnos;
        });
    }

    ionViewDidEnter() {

        // Está disponible la ubicación GPS?
        if (this.GPSAvailable) {
            // Leer la ubicación del sensor GPS
            this.ubicacionActual();
        } else {
            this.loader = false;
        }

        // Se ejecuta cuando el usueario vuelve de la config de GPS del dispositivo (resume)
        if (this.platform.is('android') || this.platform.is('ios')) {

            this.platform.resume.subscribe(() => {
                // Reiniciamos controles
                this.loader = true;
                this.hayTurnos = false;
                // Volver a leer la ubicación del sensor GPS
                this.ubicacionActual();
            });
        } else {
            // Es navegador? (dev)
            this.ubicacionActual();
        }
    }



    // Usa latitud y longitud para busca agendas
    ubicacionActual() {
        if (this.gMaps.actualPosition) {
            const userLocation = { lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude };
            this.getAgendasDisponibles(userLocation);
            this.GPSAvailable = true;
        } else {
            this.gMaps.getGeolocation().then(position => {
                const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                this.getAgendasDisponibles(userLocation);
                this.GPSAvailable = true;

            }).catch(error => {
                console.error('Error de geolocalización', error);
            });
        }
    }

    private getAgendasDisponibles(userLocation) {
        this.agendasService.getAgendasDisponibles({ userLocation: JSON.stringify(userLocation), idPaciente: this.idPaciente })
            .subscribe((data: any[]) => {
                if (data) {
                    if (data.length === 0) {
                        this.hayTurnos = false;
                    }
                    this.organizacionAgendas = data;
                    this.buscarPrestaciones(data);
                }
            });
    }

    // Busca los tipos de prestación turneables y verifica que ya el paciente no haya sacado un turno para ese tipo de prestación.
    buscarPrestaciones(organizacionAgendas) {
        this.prestacionesTurneables = [];
        organizacionAgendas.forEach(org => {
            org.agendas.forEach(agenda => {
                agenda.bloques.forEach(bloque => {
                    if (bloque.restantesMobile > 0 || agenda.cumpleRegla) {
                        bloque.tipoPrestaciones.forEach(prestacion => {
                            const exists = this.prestacionesTurneables.some(elem => elem.conceptId === prestacion.conceptId);
                            const conTurno = this.turnosActuales.some(turno => turno.tipoPrestacion.conceptId === prestacion.conceptId
                                && turno.estado === 'asignado');
                            if (!exists && !conTurno) {
                                this.prestacionesTurneables.push(prestacion);
                                this.hayTurnos = true;
                                this.loader = false;
                            }
                        });
                    }
                });
            });
        });
        if (this.prestacionesTurneables.length === 0) {
            this.loader = false;
        }
    }

    buscarTurnoPrestacion(prestacion) {
        this.turnosProvider.storage.set('prestacion', prestacion);
        this.router.navigate(['/turnos/buscar-turnos'], { queryParams: { idPaciente: this.idPaciente } });
    }


}
