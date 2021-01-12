import { AuthProvider } from './../../../providers/auth/auth';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage'

import { VacunasProvider } from '../../../providers/vacunas/vacunas';
import { ToastProvider } from '../../../providers/toast';
import { ErrorReporterProvider } from '../../../providers/errorReporter';

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
        public storage: Storage,
        public vacunasProvider: VacunasProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        public authProvider: AuthProvider,
        public reporter: ErrorReporterProvider) { }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
                if (!this.familiar.documento) {
                    this.esTemporal = true;
                }
            }
            this.getVacunas();
            this.reporter.alert();
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
}
