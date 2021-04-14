import { EventsService } from 'src/app/providers/events.service';
import { Component } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { AuthProvider } from 'src/providers/auth/auth';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ErrorReporterProvider } from 'src/providers/errorReporter';

@Component({
    selector: 'app-page-home',
    templateUrl: 'home.page.html'
})
export class HomePage {
    started = false;
    user: any;
    familiar = false;

    constructor(
        public authService: AuthProvider,
        private menuCtrl: MenuController,
        private reporter: ErrorReporterProvider,
        private storage: Storage,
        private events: EventsService,
        private alertCtrl: AlertController,
        private router: Router,
    ) {

    }

    ionViewDidEnter() {

        this.menuCtrl.enable(true, 'principal');

        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = true;
                this.user = value;
            } else {
                this.familiar = false;
                this.user = this.authService.user;
            }
        });
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
            this.router.navigateByUrl('/login');
        } else {
            this.reporter.report();
        }
    }

    rup() {
        this.router.navigate(['profesional/consultorio']);
    }

    numerosUtiles() {
        this.router.navigate(['/datos-utiles/numeros']);
    }

    vacunas() {
        if (this.isLogin()) {
            this.router.navigate(['vacunas']);
        }
    }

    laboratorio() {
        if (this.isLogin()) {
            this.router.navigate(['laboratorios']);
        }
    }

    campanias() {
        this.router.navigate(['datos-utiles/campanias']);
    }

    farmacias() {
        this.router.navigate(['/datos-utiles/farmacias']);
    }

    noticias() {
        this.router.navigate(['datos-utiles/noticias']);
    }

    misTurnos() {
        if (this.isLogin()) {
            this.router.navigateByUrl('/turnos');
        }
    }

    misAgendas() {
        if (this.isLogin()) {
            this.router.navigate(['profesional/agendas']);
        }
    }

    mpi() {
        if (this.isLogin()) {
            this.router.navigate(['profesional/mpi']);
        }
    }

    centrosDeSalud() {
        this.router.navigate(['datos-utiles/centros']);
    }

    historiaDeSalud() {
        if (this.isLogin()) {
            this.router.navigate(['historia-salud']);
        }
    }

    misFamiliares() {
        if (this.isLogin()) {
            this.router.navigate(['/mis-familiares']);
        }
    }

    salirDeFamiliar() {
        if (this.isLogin()) {
            this.storage.set('familiar', '');
            this.familiar = false;
            this.user = this.authService.user;
        }
    }

    formularioTerapeutico() {
        this.router.navigate(['profesional/formulario-terapeutico']);
    }

    get background() {
        return (this.familiar ? 'familiar' : 'dark');
    }

}
