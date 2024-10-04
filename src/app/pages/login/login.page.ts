import { Component, OnInit } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { DeviceProvider } from 'src/providers/auth/device';
import { ToastProvider } from 'src/providers/toast';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    email: string;
    password: string;
    loading = false;
    emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    activacion = false;

    constructor(
        public authService: AuthProvider,
        private toastCtrl: ToastProvider,
        private deviceProvider: DeviceProvider,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['activacion']) {
                this.activar();
            }
        });
    }

    public login() {
        this.loading = true;
        if (!this.email || !this.password) {
            this.toastCtrl.danger('Complete los datos para ingresar.');
            return;
        }
        this.email = this.email.toLocaleLowerCase();
        if (this.emailRegex.test(this.email)) {
            // Login pacientes
            const credentials = {
                email: this.email,
                password: this.password
            };
            this.loading = true;
            this.authService.login(credentials).then((result) => {
                this.loading = false;
                this.deviceProvider.sync();
                this.router.navigateByUrl('/home/paciente');
            }, (err) => {
                this.loading = false;
                if (err) {
                    if (err.message === 'new_password_needed') {
                        this.router.navigate(['registro/user-data'], {
                            queryParams: {
                                email: this.email,
                                old_password: this.password
                            }
                        });
                    } else {
                        this.loading = false;
                        this.toastCtrl.danger('Email o password incorrecto.');
                    }
                }
            });
        } else {
            this.loading = false;
            this.toastCtrl.danger('Credenciales incorrectas');
        }
    }

    public registrarse() {
        this.router.navigate(['/login/informacion-validacion']);
    }

    public activar() {
        this.email = '';
        this.password = '';
        this.activacion = !this.activacion;
    }

    public onKeyPress($event, tag) {
        if ($event.keyCode === 13) {
            // Enviar con ENTER sólo si aun no está cargando
            // (...no sé por que captura un ENTER una app móvil)
            if (tag === 'submit' && !this.loading) {
                this.login();
            } else {
                const element = document.getElementById(tag);
                if (element) {
                    element.focus();
                }
            }
        }
    }
    onBackButtonClick() {
        this.activacion = false;
    }

}
