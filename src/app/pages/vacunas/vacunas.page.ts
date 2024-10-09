import { AuthProvider } from './../../../providers/auth/auth';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/providers/storage-provider.service';

import { VacunasProvider } from '../../../providers/vacunas/vacunas';
import { ErrorReporterProvider } from '../../../providers/library-services/errorReporter';

import { Router } from '@angular/router';

@Component({
    selector: 'app-vacunas',
    templateUrl: './vacunas.page.html',
    styleUrls: ['./vacunas.page.scss'],
})
export class VacunasPage implements OnInit {
    vacunas: any[] = null;
    familiar: any = false;
    esTemporal: any = false;

    constructor(
        private storage: StorageService,
        private vacunasProvider: VacunasProvider,
        private authProvider: AuthProvider,
        private reporter: ErrorReporterProvider,
        private router: Router) { }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
                if (!this.familiar.documento) {
                    this.esTemporal = true;
                }
            }
            this.getVacunas();
            // this.reporter.alert();
        });
    }

    onBugReport() {
        this.reporter.report();
    }

    getVacunas() {
        let idPaciente;
        if (this.familiar) {
            if (this.esTemporal) {
                return;
            } else {
                idPaciente = this.familiar.id;
            }
        } else {
            idPaciente = this.authProvider.user.pacientes[0].id;
        }
        this.vacunasProvider.getByPaciente(idPaciente).then((data: any[]) => {
            this.vacunas = data;
        }).catch(() => {
            this.vacunas = [];
        });
    }

    ingresarDetalleVacuna(vacuna) {
        this.router.navigate(['vacunas/vacunas-detalle'], { queryParams: { vacuna: JSON.stringify(vacuna) } });
    }
}
