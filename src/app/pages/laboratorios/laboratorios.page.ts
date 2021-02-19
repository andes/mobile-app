import { Component, OnInit } from '@angular/core';
import { AuthProvider } from './../../../providers/auth/auth';
import { AlertController } from '@ionic/angular';
import { PacienteProvider } from '../../../providers/paciente';
import * as moment from 'moment';
import { ENV } from '@app/env';
import { Storage } from '@ionic/storage';
import { ErrorReporterProvider } from '../../../providers/errorReporter';

@Component({
    selector: 'app-laboratorios',
    templateUrl: './laboratorios.page.html',
    styleUrls: ['./laboratorios.page.scss'],
})
export class LaboratoriosPage implements OnInit {
    cdas: any[] = null;
    hayMas = false;
    buscando = false;
    count = 0;
    pageSize = 10;
    familiar: any = false;

    constructor(
        private storage: Storage,
        private pacienteProvider: PacienteProvider,
        private authProvider: AuthProvider,
        private alertCtrl: AlertController,
        private reporter: ErrorReporterProvider) {
    }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            this.getCDAS();
        });
    }

    getCDAS() {
        if (this.authProvider.user) {
            let idPaciente;
            if (this.familiar) {
                idPaciente = this.familiar.id;
            } else {
                idPaciente = this.authProvider.user.pacientes[0].id;
            }
            this.pacienteProvider.laboratorios(idPaciente, {}).then((cdas: any[]) => {
                this.cdas = cdas.map(item => {
                    item.fecha = moment(item.fecha);
                    return item;
                });
                this.hayMas = cdas.length === 10;
            });
        }
    }

    buscar() {
        this.count++;
        this.buscando = true;
        const pacienteId = this.authProvider.user.pacientes[0].id;
        this.pacienteProvider.laboratorios(pacienteId, { limit: 10, skip: this.count * 10 }).then((cdas: any[]) => {
            this.buscando = false;
            cdas.forEach(item => {
                item.fecha = moment(item.fecha);
                this.cdas.push(item);
            });
            this.hayMas = cdas.length === 10;
        });
    }

    async link(cda) {
        if (cda.confidentialityCode !== 'R') {
            const url = ENV.API_URL + 'modules/cda/' + cda.adjuntos[0] + '?token=' + this.authProvider.token;
            window.open(url);
        } else {
            const alert = await this.alertCtrl.create({
                header: 'Atención',
                subHeader: 'Este resultado debe ser retirado personalmente por el establecimiento de salud.',
                buttons: ['Entiendo']
            });
            await alert.present();
        }
    }

    onBugReport() {
        this.reporter.report();
    }

}
