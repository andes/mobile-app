import { Component } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { DeviceProvider } from 'src/providers/auth/device';
import { ToastProvider } from 'src/providers/toast';
import { Router } from '@angular/router';
import * as shiroTrie from 'shiro-trie';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage {
    email: string;
    password: string;
    inProgress = false;
    emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    dniRegex = /^[0-9]{7,8}$/;

    constructor(
        private authService: AuthProvider,
        private toastCtrl: ToastProvider,
        private deviceProvider: DeviceProvider,
        private router: Router
    ) { }

    public login() {
        if (!this.email || !this.password) {
            this.toastCtrl.danger('Complete los datos para ingresar.');
            return;
        }
        this.email = this.email.toLocaleLowerCase();
        if (!this.dniRegex.test(this.email)) {
            // Login pacientes
            const credentials = {
                email: this.email,
                password: this.password
            };
            this.inProgress = true;
            this.authService.login(credentials).then((result) => {
                this.inProgress = false;
                this.deviceProvider.sync();
                this.router.navigateByUrl('/home');
            }, (err) => {
                this.inProgress = false;
                if (err) {
                    if (err.message === 'new_password_needed') {
                        // this.navCtrl.push(RegistroUserDataPage, {
                        //     email: this.email,
                        //     old_password: this.password
                        // })
                        // this.toastCtrl.danger("GOTO SET PASSWORD");
                    } else {
                        this.toastCtrl.danger('Email o password incorrecto.');
                    }
                }
            });
        } else {
            // Login profesional
            const credenciales = {
                usuario: this.email,
                password: this.password,
                mobile: true
            };
            this.inProgress = true;
            this.authService.loginProfesional(credenciales).then((resultado) => {
                this.inProgress = false;
                this.deviceProvider.sync();
                const params = {
                    esGestion: resultado.user.esGestion ? resultado.user.esGestion : false,
                    mantenerSesion: resultado.user.mantenerSesion ? resultado.user.mantenerSesion : true
                };
                let tienePermiso = false;
                const shiro = shiroTrie.newTrie();
                shiro.add(resultado.user.permisos);
                if (shiro.check('appGestion:accesoIndicadores')) {
                    tienePermiso = true;
                }
                if (resultado.user) {
                    this.router.navigate(['/login/disclaimer']);
                }
            }).catch(() => {
                this.inProgress = false;
                this.toastCtrl.danger('Credenciales incorrectas');
            });

        }
    }

    public onKeyPress($event, tag) {
        if ($event.keyCode === 13) {
            if (tag === 'submit') {
                this.login();
            } else {
                const element = document.getElementById(tag);
                if (element) {
                    element.focus();
                }
            }
        }
    }

}
