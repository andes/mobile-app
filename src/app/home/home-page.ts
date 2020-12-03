import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthProvider } from 'src/providers/auth/auth';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorReporterProvider } from 'src/providers/errorReporter';
import { Subscription } from 'rxjs';
import { EventsService } from '../providers/events.service';

@Component({
    selector: 'app-page-home',
    templateUrl: 'home.page.html'
})
export class HomePage {
    started = false;
    user: any;
    // showMpi = false;
    familiar = false;
    // private events = new Subject();


    constructor(
        public authService: AuthProvider,
        // public deviceService: DeviceProvider,
        public menuCtrl: MenuController,
        public reporter: ErrorReporterProvider,
        public storage: Storage,
        public router: Router,
        public events: EventsService
    ) { }

    ionViewWillEnter() {
        this.menuCtrl.enable(true, 'principal');
        // this.events.publish('myEvent');
        // this.events.setTipoIngreso('gestion');

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

    // faq() {
    //     // this.navCtrl.push(FaqPage);
    // }

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

    formularioTerapeutico() {
        this.router.navigate(['profesional/formulario-terapeutico']);
    }

}
