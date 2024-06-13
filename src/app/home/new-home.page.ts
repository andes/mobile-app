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
    templateUrl: 'new-home.page.html',
    styleUrls: ['./home.page.scss'],
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
        private router: Router
    ) { }


    ionViewWillEnter() {
        this.authService.checkAuth().then(() => {
            if (this.isLogin()) {
                this.router.navigateByUrl('/home/paciente');
            }
        });
    }

    clickInit(perfil) {
        if (perfil === 'paciente') {
            this.router.navigateByUrl('/login');
        } else {
            if (perfil === 'profesional') {
                this.router.navigateByUrl('/login/profesional');
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
