import { Component } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { StorageService } from 'src/providers/storage-provider.service';
import { Router } from '@angular/router';
import { ErrorReporterProvider } from 'src/providers/errorReporter';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { ProfesionalProvider } from 'src/providers/profesional';

@Component({
    selector: 'app-page-home',
    templateUrl: 'new-home.page.html'
})
export class newHomePage {
    started = false;
    user: any;
    familiar = false;
    idPaciente;
    private newLogin = true;

    constructor(
        public authService: AuthProvider,
        public alertController: AlertController,
        private reporter: ErrorReporterProvider,
        private storage: StorageService,
        private router: Router,
        private profesionalProvider: ProfesionalProvider
    ) { }


    ionViewWillEnter() {
        this.authService.checkAuth().then(() => {
            if (this.isLogin()) {
                // Cada vez que se loguea un profesional, se verifica el vencimiento de sus matriculas de grado
                if (this.isProfesional() && this.newLogin) {

                }

            }
        });
    }

    clickInit(perfil) {
        if (perfil === 'paciente') {
            this.router.navigateByUrl('/login');
        }
        else {
            if (perfil === 'profesional') {
                this.router.navigateByUrl('/login');
            }
        }
    }

    ionViewDidLeave() {
        if (!this.isLogin()) {
            this.newLogin = true;
        }
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
}
