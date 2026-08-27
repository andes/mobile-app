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
    private turnosSubscription: Subscription;
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
        // Se guarda lista de turnos vigentes
        this.storage.set('Geolocation', null);
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            this.onResumeSubscription = this.platform.resume.subscribe(() => {
                this.getTurnos(); // actualización al volver a la app
            });

            this.getTurnos(); // carga inicial de turnos al entrar a la página
        });
    }

    ngOnDestroy() {
        if (this.onResumeSubscription) {
            this.onResumeSubscription.unsubscribe();
        }

        if (this.turnosSubscription) {
            this.turnosSubscription.unsubscribe();
        }
    }

    getTurnos() {
        if (this.turnosSubscription) {
            this.turnosSubscription.unsubscribe();
        }

        const params = { horaInicio: moment(new Date()).format(), familiar: JSON.stringify(this.familiar) };

        this.turnosSubscription = this.turnosProvider.get(params).subscribe((data: any[]) => {
            this.turnos = data;
            this.habilitarTurnos = true;
        });
    }

    clickEvent(event) {
        this.router.navigate(['/turnos/detalle'], { queryParams: { turno: JSON.stringify(event) } });
    }

    buscarPrestacion() {

        // Se guarda lista de turnos vigentes
        this.storage.set('turnos', { turnos: this.turnos });
        this.router.navigate(['/turnos/prestaciones'], { queryParams: { idPaciente: this.idPaciente } });

    }

    abrirHistorial() {
        this.router.navigate(['/turnos/historial']);
    }

    abrirListado() {
        this.router.navigate(['/turnos/listado']);
    }
}
