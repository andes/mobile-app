import { Observable, of, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { GeoProvider } from 'src/providers/library-services/geo-provider';
import { AgendasProvider } from 'src/providers/agendas';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/providers/storage-provider.service';
import { TurnosProvider } from 'src/providers/turnos';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';
@Component({
    selector: 'app-turnos-prestaciones',
    templateUrl: 'turnos-prestaciones.html',
    styleUrls: ['turnos-prestaciones.scss']
})

export class TurnosPrestacionesPage implements OnDestroy, OnInit {
    public turnosActuales: any = [];
    public prestacionesTurneables: any = [];
    public loader = false;
    public familiar = false;
    public organizacionAgendas;
    public hayTurnos = false;
    public GPSAvailable = false;
    private idPaciente;
    public prestacionesConTurnoAsignado: any = [];
    private AgendasSubscription: Subscription;
    public loading = true;
    private actualPosition = null;

    constructor(
        public gMaps: GeoProvider,
        private agendasService: AgendasProvider,
        private storage: StorageService,
        private turnosProvider: TurnosProvider,
        private router: Router,
        private route: ActivatedRoute,
        private platform: Platform,
        public checker: CheckerGpsProvider,
        public alertController: AlertController) {
    }

    /* get loading() {
         return this.loader && (!this.hayTurnos && this.GPSAvailable);
     }*/

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
        this.route.queryParams.subscribe(params => {
            this.idPaciente = params.idPaciente;
        });
        // Es un dispositivo?
        if (this.platform.is('android') || this.platform.is('ios')) {
            // Fuerza el pedido de permiso de GPS antes de intentar geolocalizar
            this.checker.diagnostic.isLocationEnabled().then((enabled: boolean) => {
                if (enabled) {
                    // Tiene capacidad GPS?
                    this.checker.isGPSAvailable().then(available => {
                        this.GPSAvailable = available;
                    });
                    this.loader = true;

                    this.platform.resume.subscribe(() => {
                        // Reiniciamos controles
                        this.loader = true;
                        this.hayTurnos = false;
                        this.ubicacionActual();
                    });
                } else { // GPS activado?
                    // Sin permiso para GPS, muestra mensaje "Activar por favor" en HTML
                    this.solicitarUbicacion();
                }
            });
        }

    }

    async solicitarUbicacion() {
        const alert = await this.alertController.create({
            header: 'Acceder a ubicación',
            subHeader: 'Para poder utilizar este servicio, deberá activar la ubicación en su dispositivo.',
            buttons: [{
                text: 'Continuar',
                handler: () => this.checker.requestGeoRef()
            }]
        });
        await alert.present();
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
        this.storage.get('turnos').then((turnos) => {
            this.turnosActuales = turnos.turnos;
        });

        // Cargamos turnos actuales
        this.storage.get('Geolocation').then((posicion) => {
            this.actualPosition = posicion;
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
    }

    // Usa latitud y longitud para busca agendas
    ubicacionActual() {
        if (this.actualPosition) {
            this.getAgendasDisponibles(this.actualPosition);
            this.GPSAvailable = true;
        } else {
            this.gMaps.getGeolocation().then(position => {
                const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                this.storage.set('Geolocation', userLocation);
                this.getAgendasDisponibles(userLocation);
                this.GPSAvailable = true;

            }).catch(error => {
                console.error('Error de geolocalización', error);
            });
        }
    }

    private getAgendasDisponibles(userLocation) {

        if (this.AgendasSubscription) {
            this.AgendasSubscription.unsubscribe();
        }

        this.AgendasSubscription = this.agendasService.getAgendasDisponibles({ userLocation: JSON.stringify(userLocation), idPaciente: this.idPaciente })
            .subscribe((data: any[]) => {
                this.loader = false;
                if (data) {
                    if (data.length === 0) {
                        this.hayTurnos = false;

                    }
                    this.organizacionAgendas = data;
                    this.buscarPrestaciones(data);
                    this.AgendasSubscription.unsubscribe();
                }
            });
    }

    ngOnDestroy() {
        if (this.AgendasSubscription) {
            this.AgendasSubscription.unsubscribe();
        }
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
                            this.turnosActuales.forEach(turno => {
                                const existsEnTurno = this.prestacionesConTurnoAsignado.some(elem => elem.agenda_id === prestacion.agenda_id);
                                if (turno.tipoPrestacion.conceptId === prestacion.conceptId &&
                                    turno.estado !== 'suspendido' && !existsEnTurno) {
                                    this.prestacionesConTurnoAsignado.push(turno);
                                }
                            }
                            );
                            if (!exists) {
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
        const conTurno = this.prestacionesConTurnoAsignado.find(elem => elem.tipoPrestacion.conceptId === prestacion.conceptId);
        if (!conTurno) {
            this.storage.set('prestacion', prestacion);
            this.router.navigate(['/turnos/buscar-turnos'], { queryParams: { idPaciente: this.idPaciente } });
        } else {
            this.modal(conTurno);
        }

    }

    public async modal(turno) {
        const confirm = await this.alertController.create({
            header: 'Importante',
            message: 'Usted ya posee un turno con la prestación: <br><strong>' + turno.tipoPrestacion.term + '<strong>',
            cssClass: 'custom-alert-header custom-alert-message',
            buttons: [
                {
                    text: 'Ir al turno',
                    cssClass: 'custom-alert-button-accept',
                    handler: () => {
                        this.router.navigate(['/turnos/detalle'], { queryParams: { turno: JSON.stringify(turno) } });
                    }
                }
            ]
        });
        await confirm.present();
    }
}
