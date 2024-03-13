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
    templateUrl: 'home.page.html'
})
export class HomePage {
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
                    this.profesionalProvider.getById(this.authService.user.profesionalId).then((resp: any) => {
                        this.newLogin = false;
                        const proximaAVencer = resp[0].formacionGrado.find(formacion => {
                            if (!formacion.matriculacion?.length) {
                                return false;
                            }
                            const vencimiento = moment(formacion.matriculacion[formacion.matriculacion.length - 1].fin);
                            return vencimiento.isBetween(moment(), moment().add(30, 'days'), null, '[]');
                        });
                        if (proximaAVencer) {
                            this.notificacionVencimientoMetricula(proximaAVencer);
                        }
                    });
                }
                this.storage.get('familiar').then((value) => {
                    if (value) {
                        this.familiar = true;
                        this.idPaciente = value.id;
                        this.user = value;
                    } else {
                        this.familiar = false;
                        this.user = this.authService.user;
                        if (this.isPaciente()) {
                            this.idPaciente = this.authService.user.pacientes[0].id;
                        }
                    }
                });
            }
        });
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
            this.router.navigate(['/turnos'], { queryParams: { idPaciente: this.idPaciente } });
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
        this.router.navigate(['datos-utiles/centros'], { queryParams: { tipo: 'centro-salud' } });
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

    misMatriculas() {
        this.router.navigate(['profesional/mis-matriculas']);
    }


    get background() {
        return ((this.isLogin() && this.familiar) ? 'familiar' : 'dark');
    }

    private async notificacionVencimientoMetricula(formacionGrado) {
        const confirm = await this.alertController.create({
            header: 'Aviso de vencimiento',
            message: `<p>Su matrícula de <b>${formacionGrado.profesion.nombre}</b> se vencerá el día ${moment(formacionGrado.matriculacion[formacionGrado.matriculacion.length - 1].fin).format('DD [de] MMMM')}.<br>Puede iniciar la renovación desde el menú <b>Mis matrículas</b>.</p>`,
            buttons: [
                {
                    text: 'Continuar',
                    handler: () => { }
                }
            ]
        });
        await confirm.present();
    }
}
