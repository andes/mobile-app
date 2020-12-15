import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

// providers
import { ToastProvider } from 'src/providers/toast';
import { GeoProvider } from 'src/providers/geo-provider';
import { AgendasProvider } from 'src/providers/agendas';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorReporterProvider } from 'src/providers/errorReporter';


@Component({
    selector: 'app-turnos-prestaciones',
    templateUrl: 'turnos-prestaciones.html'
})

export class TurnosPrestacionesPage implements OnInit, OnDestroy {
    private onResumeSubscription: Subscription;
    //    private organizacionAgendas: any = [];
    private turnosActuales: any = [];
    public prestacionesTurneables: any = [];
    private organizacionAgendas: any = [];
    public loader = true;

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.turnosActuales = JSON.parse(params.turnos);
            this.loader = true;
            if (this.gMaps.actualPosition) {
                const userLocation = { lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude };
                this.getAgendasDisponibles(userLocation);
            } else {
                this.gMaps.getGeolocation().then(position => {
                    const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                    this.getAgendasDisponibles(userLocation);
                }).catch(error => {
                    console.log('error ', error);
                });
            }
        });
    }

    constructor(
        public gMaps: GeoProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public toast: ToastProvider,
        public reporter: ErrorReporterProvider,
        public agendasService: AgendasProvider,
        private route: ActivatedRoute,
        private router: Router,
        public platform: Platform) {

        this.onResumeSubscription = platform.resume.subscribe(() => {
            // this.checker.checkGPS();
        });
    }

    // Trae las prestaciones que posen cupo para mobile.
    async ionViewDidLoad() {
        this.route.queryParams.subscribe(params => {
            this.turnosActuales = JSON.parse(params.turnos);
            this.loader = true;
            if (this.gMaps.actualPosition) {
                const userLocation = { lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude }
                this.getAgendasDisponibles(userLocation);
            } else {
                this.gMaps.getGeolocation().then(position => {
                    const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                    this.getAgendasDisponibles(userLocation);
                });
            }
        });
    }

    private getAgendasDisponibles(userLocation) {
        this.agendasService.getAgendasDisponibles(userLocation).subscribe((data) => {
            if (data) {
                console.log(data);
                this.organizacionAgendas = data;
                this.buscarPrestaciones(data);
            } else {
                this.loader = false;
            }
        });
    }

    // Busca los tipos de prestación turneables y verifica que ya el paciente no haya sacado un turno para ese tipo de prestación.
    buscarPrestaciones(organizacionAgendas) {
        this.prestacionesTurneables = [];
        this.loader = false;
        organizacionAgendas.forEach(org => {
            org.agendas.forEach(agenda => {
                agenda.bloques.forEach(bloque => {
                    if (bloque.restantesMobile > 0) {
                        bloque.tipoPrestaciones.forEach(prestacion => {
                            const exists = this.prestacionesTurneables.some(elem => elem.conceptId === prestacion.conceptId);
                            const conTurno = this.turnosActuales.some(turno => turno.tipoPrestacion.conceptId === prestacion.conceptId);
                            if (!exists && !conTurno) {
                                this.prestacionesTurneables.push(prestacion);
                            }
                        });
                    }
                });
            });
        });
    }

    buscarTurnoPrestacion(prestacion) {
        this.router.navigate(['/turnos/buscar-turnos'], { queryParams: { prestacion: JSON.stringify(prestacion) } });
    }

    onBugReport() {
        // this.reporter.report();
    }

}
