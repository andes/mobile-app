
import { TurnosProvider } from '../../../../providers/turnos';
import * as moment from 'moment/moment';
import { ErrorReporterProvider } from '../../../../providers/errorReporter';
import { StorageService } from 'src/providers/storage-provider.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GeoProvider } from 'src/providers/geo-provider';
import { CheckerGpsProvider } from 'src/providers/locations/checkLocation';

@Component({
    selector: 'app-listado-turnos',
    templateUrl: 'listado-turnos.html',
})

export class ListadoTurnosPage implements OnDestroy, OnInit {
    public familiar: any = false;
    public turnos: any[] = null;
    public habilitarTurnos = false;
    private onResumeSubscription: Subscription;
    sinGPS = false;
    idPaciente;

    constructor(
        private route: ActivatedRoute,
        private platform: Platform,
        private storage: StorageService,
        private turnosProvider: TurnosProvider,
        public gMaps: GeoProvider,
        private router: Router,
        public checker: CheckerGpsProvider,
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

}
