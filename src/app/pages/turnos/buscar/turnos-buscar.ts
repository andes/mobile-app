import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GeoProvider } from 'src/providers/library-services/geo-provider';
// src/providers
import { AgendasProvider } from 'src/providers/agendas';
import { TurnosProvider } from 'src/providers/turnos';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';
import { ErrorReporterProvider } from 'src/providers/library-services/errorReporter';
import { StorageService } from 'src/providers/storage-provider.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-turnos-buscar',
    templateUrl: 'turnos-buscar.html'
})

export class TurnosBuscarPage implements OnInit, OnDestroy {

    prestacion: any;
    efectores: any[] = null;
    points: any[];
    position: any = {};
    lugares: any[];
    geoSubcribe;
    myPosition = null;
    private onResumeSubscription: Subscription;
    familiar = false;
    private idPaciente;

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    constructor(
        private turnosProvider: TurnosProvider,
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

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.idPaciente = params.idPaciente;
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
        });
    }

    getTurnosDisponibles() {
        if (this.gMaps.actualPosition) {
            const userLocation = { lat: this.gMaps.actualPosition.latitude, lng: this.gMaps.actualPosition.longitude };
            this.getTurnosDisponiblesAux(userLocation);
        } else {
            this.gMaps.getGeolocation().then(position => {
                const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                this.getTurnosDisponiblesAux(userLocation);
            });
        }
    }
    private getTurnosDisponiblesAux(userLocation) {
        this.agendasService.getAgendasDisponibles({
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

    turnosDisponibles(efector) {
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
