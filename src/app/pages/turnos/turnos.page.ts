import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
import { TurnosProvider } from 'src/providers/turnos';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { GeoProvider } from 'src/providers/geo-provider';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';

@Component({
    selector: 'app-turnos',
    templateUrl: './turnos.page.html'
})

export class TurnosPage implements OnDestroy, OnInit {
    public familiar: any = false;
    public turnos: any[] = null;
    public habilitarTurnos = false;
    private onResumeSubscription: Subscription;
    sinGPS = false;

    constructor(
        private menuCtrl: MenuController,
        private platform: Platform,
        private storage: Storage,
        private turnosProvider: TurnosProvider,
        public gMaps: GeoProvider,
        private router: Router,
        public checker: CheckerGpsProvider
    ) {
    }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            this.onResumeSubscription = this.platform.resume.subscribe(() => {
                this.getTurnos();
            });
            this.getTurnos();
        });
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

    ionViewWillEnter() {
        this.sinGPS = false;
    }

    getTurnos() {
        const params = { horaInicio: moment(new Date()).format(), familiar: JSON.stringify(this.familiar) };
        this.turnosProvider.get(params).subscribe((data: any[]) => {
            this.turnos = data;
            this.habilitarTurnos = true;
        });
    }

    onCancelTurno(event) {
        this.turnos = this.turnos.filter(item => item._id !== event._id);
    }

    clickEvent(event) {
        this.router.navigate(['/turnos/detalle'], { queryParams: { turno: JSON.stringify(event) } });
    }

    buscarPrestacion() {

        // Se guarda lista de turnos vigentes
        this.turnosProvider.storage.set('turnos', { turnos: this.turnos });

        // Fuerza el pedido de permiso de GPS antes de intentar geolocalizar
        this.checker.diagnostic.isLocationEnabled().then((enabled: boolean) => {
            // GPS activado?
            if (enabled) {
                // Hay permisos para acceder a datos de GPS?
                this.gMaps.getGeolocation().then(value => {
                    this.router.navigate(['/turnos/prestaciones']);
                });
            } else {
                // Sin permiso para GPS, muestra mensaje "Activar en HTML"
                this.sinGPS = true;

                // Espera a que se active, e intenta acceder a la geolocalización
                this.platform.resume.subscribe(() => {
                    this.gMaps.getGeolocation().then(value => {
                        this.router.navigate(['/turnos/prestaciones']);
                    });
                });

            }

        });

    }

    abrirHistorial() {
        this.router.navigate(['/turnos/historial']);
    }

    activarUbicacion() {
        // Ir a config de GPS del dispositivo
        this.checker.requestGeoRef();
    }
}
