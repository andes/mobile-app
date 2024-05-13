import { Component } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { DeviceProvider } from 'src/providers/auth/device';
import { ToastProvider } from 'src/providers/toast';
import { Router } from '@angular/router';
import * as shiroTrie from 'shiro-trie';

@Component({
    selector: 'app-login-profesional',
    templateUrl: './loginProfesional.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginProfesionalPage {
    documento: string;
    password: string;
    loading = false;
    dniRegex = /^[0-9]{7,8}$/;
    activacion = false;

    constructor(
        public authService: AuthProvider,
        private toastCtrl: ToastProvider,
        private deviceProvider: DeviceProvider,
        private router: Router
    ) { }

    public login() {
        this.loading = true;
        if (!this.documento || !this.password) {
            this.toastCtrl.danger('Complete los datos para ingresar.');
            return;
        }
        if (this.dniRegex.test(this.documento)) {
            // Login profesional
            const credenciales = {
                usuario: this.documento,
                password: this.password,
                mobile: true
            };
            this.authService.loginProfesional(credenciales).then((resultado) => {
                this.loading = false;
                this.deviceProvider.sync();
                let tienePermiso = false;
                const shiro = shiroTrie.newTrie();
                shiro.add(resultado.user.permisos);
                if (resultado.user) {
                    this.router.navigate(['/login/disclaimer']);
                }
            }).catch(() => {
                this.loading = false;
                this.toastCtrl.danger('Credenciales incorrectas');
            });
        } else {
            this.toastCtrl.danger('Credenciales incorrectas');
        }
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

}