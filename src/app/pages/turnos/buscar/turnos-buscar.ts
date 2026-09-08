import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GeoProvider } from 'src/providers/library-services/geo-provider';
// src/providers
import { AgendasProvider } from 'src/providers/agendas';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';
import { ErrorReporterProvider } from 'src/providers/library-services/errorReporter';
import { StorageService } from 'src/providers/storage-provider.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-turnos-buscar',
    templateUrl: 'turnos-buscar.html'
})

export class TurnosBuscarPage implements OnDestroy {

    prestacion: any;
    efectores: any[] = null;
    position: any = {};
    private onResumeSubscription: Subscription;
    familiar = false;
    private idPaciente;
    private AgendasSubscription: Subscription;
    private actualPosition = null;

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        if (this.onResumeSubscription) {
            this.onResumeSubscription.unsubscribe();
        }
        if (this.AgendasSubscription) {
            this.AgendasSubscription.unsubscribe();
        }
    }

    constructor(
        private agendasService: AgendasProvider,
        private gMaps: GeoProvider,
        private checker: CheckerGpsProvider,
        private reporter: ErrorReporterProvider,
        private platform: Platform,
        private router: Router,
        private route: ActivatedRoute,
        private storage: StorageService,
    ) {
    }

    ionViewWillEnter() {
        this.initializeComponent();
    }

    private initializeComponent() {
        this.route.queryParams.subscribe(params => {
            this.idPaciente = params.idPaciente;
        });
        this.storage.get('Geolocation').then((posicion) => {
            this.actualPosition = posicion;
        });
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            this.onResumeSubscription = this.platform.resume.subscribe(() => {
                this.checker.checkGPS();
            });
            this.storage.get('prestacion').then(prestacion => {
                this.prestacion = prestacion;
                this.getTurnosDisponibles();
            });
            // Cargamos turnos actuales

        });
    }
    getTurnosDisponibles() {
        if (this.actualPosition) {
            this.getTurnosDisponiblesAux(this.actualPosition);
        } else {
            this.gMaps.getGeolocation().then(position => {
                const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                this.storage.set('Geolocation', userLocation);
                this.getTurnosDisponiblesAux(userLocation);
            });
        }
    }
    private getTurnosDisponiblesAux(userLocation) {

        if (this.AgendasSubscription) {
            this.AgendasSubscription.unsubscribe();
        }

        this.AgendasSubscription = this.agendasService.getAgendasDisponibles({
            ...this.prestacion, userLocation: JSON.stringify(userLocation),
            idPaciente: this.idPaciente
        }).
            subscribe((data: any[]) => {
                this.efectores = data;
            });
    }

    mostrarEfector(efector) {
        return efector.organizacion;
    }

    turnosDisponibles() {
        const agendasEfector = [];
        const listaTurnosDisponibles = [];

        agendasEfector.forEach(agenda => {
            agenda.bloques.forEach(bloque => {
                bloque.turnos.forEach(turno => {
                    if (turno.estado === 'disponible') {
                        listaTurnosDisponibles.push(turno);
                    }
                });
            });
        });
        return listaTurnosDisponibles;
    }

    buscarTurno(efector) {
        this.storage.set('calendario', { efector, prestacion: this.prestacion });
        this.router.navigate(['/turnos/calendario']);
    }

    onBugReport() {
        this.reporter.report();
    }

}
