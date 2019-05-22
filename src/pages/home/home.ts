import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { PacienteProvider } from '../../providers/paciente';

// pages
import { LoginPage } from '../login/login';
import { NumerosUtilesPage } from '../datos-utiles/numeros-emergencia/numeros-utiles';
import { FarmaciasTurnoPage } from '../datos-utiles/farmacias-turno/farmacias-turno';
import { FeedNoticiasPage } from '../datos-utiles/feed-noticias/feed-noticias';
import { CentrosSaludPage } from '../datos-utiles/centros-salud/centros-salud';
import { TurnosPage } from '../turnos/turnos';
import { AgendasPage } from '../profesional/agendas/agendas';
import { FormTerapeuticoPage } from '../profesional/form-terapeutico/form-terapeutico';
import { VacunasPage } from '../vacunas/vacunas';
import { LaboratoriosPage } from '../laboratorios/laboratorios';
import { FaqPage } from '../datos-utiles/faq/faq';
import { HistoriaDeSaludPage } from '../historia-salud/historia-salud';
import { DeviceProvider } from '../../providers/auth/device';
import { RupAdjuntarPage } from '../../pages/profesional/rup-adjuntar/rup-adjuntar';
import { RupConsultorioPage } from '../profesional/consultorio/rup-consultorio';
import { ScanDocumentoPage } from '../profesional/mpi/scan-documento/scan-documento';
import { Screenshot } from '@ionic-native/screenshot';
import { EmailComposer } from '@ionic-native/email-composer';
import { ErrorReporterProvider } from '../../providers/errorReporter';
import { CampaniasListPage } from '../datos-utiles/campanias/campanias-list';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    started = false;
    user: any;
    showMpi = false;

    constructor(
        public authService: AuthProvider,
        public deviceService: DeviceProvider,
        public navCtrl: NavController,
        public menuCtrl: MenuController,
        public reporter: ErrorReporterProvider) {

        this.user = this.authService.user;
    }
    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

    ionViewDidLoad() {
        setTimeout(() => {
            debugger;
            this.started = true;
        }, 50);
    }

    isLogin() {
        return this.authService.user != null;
    }

    isPaciente() {
        return this.authService.user && this.authService.user.profesionalId == null;
    }

    isProfesional() {
        return this.authService.user && this.authService.user.profesionalId != null;
    }

    login() {
        if (!this.isLogin()) {
            this.navCtrl.push(LoginPage);
        } else {
            //   this.reporter.report();
        }
    }

    rup() {
        this.navCtrl.push(RupConsultorioPage);
    }

    numerosUtiles() {
        this.navCtrl.push(NumerosUtilesPage);
    }

    vacunas() {
        if (this.isLogin()) {
            this.navCtrl.push(VacunasPage);
        }
    }

    laboratorio() {
        if (this.isLogin()) {
            this.navCtrl.push(LaboratoriosPage);
        }
    }

    campanias() {
        this.navCtrl.push(CampaniasListPage);
    }

    farmacias() {
        this.navCtrl.push(FarmaciasTurnoPage);
    }

    noticias() {
        this.navCtrl.push(FeedNoticiasPage);
    }

    misTurnos() {
        if (this.isLogin()) {
            this.navCtrl.push(TurnosPage);
        }
    }


    misAgendas() {
        // this.navCtrl.push(RupAdjuntarPage,  { id: '5a93fe29071906410e389279' }  );
        if (this.isLogin()) {
            this.navCtrl.push(AgendasPage);
        }
    }

    mpi() {
        if (this.isLogin()) {
            this.navCtrl.push(ScanDocumentoPage);
        }
    }

    centrosDeSalud() {
        this.navCtrl.push(CentrosSaludPage);
    }

    faq() {
        this.navCtrl.push(FaqPage);
    }

    historiaDeSalud() {
        if (this.isLogin()) {
            this.navCtrl.push(HistoriaDeSaludPage);
        }
    }

    formularioTerapeutico() {
        this.navCtrl.push(FormTerapeuticoPage);
    }

}
