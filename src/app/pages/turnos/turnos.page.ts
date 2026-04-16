import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
import { TurnosProvider } from 'src/providers/turnos';
import { StorageService } from 'src/providers/storage-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeoProvider } from 'src/providers/library-services/geo-provider';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';

@Component({
    selector: 'app-turnos',
    templateUrl: './turnos.page.html',
    styleUrls: ['turnos.scss']
})

export class TurnosPage implements OnDestroy, OnInit {
    public familiar: any = false;
    public turnos: any[] = null;
    public habilitarTurnos = false;
    private onResumeSubscription: Subscription;
    idPaciente;

    constructor(
        private route: ActivatedRoute,
        private platform: Platform,
        private storage: StorageService,
        private turnosProvider: TurnosProvider,
        public gMaps: GeoProvider,
        private router: Router,
        public checker: CheckerGpsProvider,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.idPaciente = params.idPaciente;
        });
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
        this.storage.set('turnos', { turnos: this.turnos });

        // Dispositivo?
        if (this.platform.is('android') || this.platform.is('ios')) {

            // Fuerza el pedido de permiso de GPS antes de intentar geolocalizar
            this.checker.diagnostic.isLocationEnabled().then((enabled: boolean) => {
                // GPS activado?
                if (enabled) {
                    // Hay permisos para acceder a datos de GPS?
                    this.gMaps.getGeolocation().then(value => {
                        this.router.navigate(['/turnos/prestaciones'], { queryParams: { idPaciente: this.idPaciente } });
                    });
                } else {
                    // Sin permiso para GPS, muestra mensaje "Activar por favor" en HTML
                    this.solicitarUbicacion();

                    // Espera a que se active, reintenta acceder a la geolocalización
                    this.platform.resume.subscribe(() => {
                        this.gMaps.getGeolocation().then(value => {
                            this.router.navigate(['/turnos/prestaciones'], { queryParams: { idPaciente: this.idPaciente } });
                        });
                    });

                }

            });
        } else {
            this.router.navigate(['/turnos/prestaciones'], { queryParams: { idPaciente: this.idPaciente } });
        }

    }

    abrirHistorial() {
        this.router.navigate(['/turnos/historial']);
    }

    abrirListado() {
        this.router.navigate(['/turnos/listado']);
    }

    async solicitarUbicacion() {
        const alert = await this.alertCtrl.create({
            header: 'Acceder a ubicación',
            subHeader: 'Para poder utilizar este servicio, deberá activar la ubicación en su dispositivo.',
            buttons: [{
                text: 'Continuar',
                handler: () => this.checker.requestGeoRef()
            }]
        });
        await alert.present();
    }
}
