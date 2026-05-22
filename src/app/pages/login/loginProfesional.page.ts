import { Component } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { DeviceProvider } from 'src/providers/auth/device';
import { ToastProvider } from 'src/providers/toast';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';
import { BiometricService } from 'src/providers/auth/biometric';

@Component({
    selector: 'app-login-profesional',
    templateUrl: './loginProfesional.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginProfesionalPage {
    documento: string;
    password: string;
    loading = false;
    dniRegex = /^[0-9]{7,8}$/;
    activacion = false;
    biometricAvailable = false;

    constructor(
        public authService: AuthProvider,
        private toastCtrl: ToastProvider,
        private deviceProvider: DeviceProvider,
        private iab: InAppBrowser,
        private router: Router,
        private biometricService: BiometricService,
        private alertCtrl: AlertController
    ) { }

    public login() {
        if (!this.documento || !this.password) {
            this.toastCtrl.danger('Complete los datos para ingresar.');
            return;
        }
        if (this.dniRegex.test(this.documento)) {
            // Login profesional
            const credenciales = {
                usuario: this.documento,
                password: this.password,
                mobile: true,
            };
            this.loading = true;
            this.authService.loginProfesional(credenciales).then(async (resultado) => {
                this.loading = false;
                this.deviceProvider.sync();

                const puedeMostrarMensaje = await this.biometricService.puedeMostrarMensaje('profesional');

                if (puedeMostrarMensaje) {
                    this.promptActivarBiometria();
                } else {
                    this.router.navigate(['/login/disclaimer']);
                }
            })
                .catch((err) => {
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

    async ionViewWillEnter() {
        this.biometricAvailable = await this.biometricService.estaDisponible() && await this.biometricService.biometriaActivadaPorUsuario('profesional');
    }

    async loginBiometrico() {
        const verificado = await this.biometricService.autenticar();
        if (verificado) {
            const credenciales = await this.biometricService.obtenerCredencialesSeguras();
            if (credenciales && credenciales.tipo === 'profesional') {
                this.loading = true;
                this.authService.loginProfesional({
                    usuario: credenciales.usuario,
                    password: credenciales.clave,
                    mobile: true
                }).then(() => {
                    this.loading = false;
                    this.deviceProvider.update().then(() => true, () => true);
                    this.router.navigate(['/login/disclaimer']);
                }).catch(() => {
                    this.loading = false;
                    this.toastCtrl.danger('Fallo la autenticación automática.');
                });
            } else if (credenciales && credenciales.tipo !== 'profesional') {
                this.toastCtrl.danger('Las credenciales guardadas no corresponden a este perfil.');
            }
        }
    }

    async promptActivarBiometria() {
        const alert = await this.alertCtrl.create({
            header: 'Acceso Rápido y Seguro',
            message: '¿Deseas activar el ingreso con reconocimiento facial o dactilar para ingresar más rápido, sin escribir tu contraseña?',
            buttons: [
                {
                    text: 'Ahora no',
                    role: 'cancel',
                    handler: async () => {
                        await this.biometricService.marcarComoRechazado(true, 'profesional');
                        this.router.navigate(['/login/disclaimer']);
                    }
                },
                {
                    text: 'Activar',
                    handler: async () => {
                        try {
                            const verificado = await this.biometricService.autenticar();
                            if (verificado) {
                                await this.biometricService.guardarCredencialesSeguras(this.documento, this.password, 'profesional');
                                this.toastCtrl.success('¡Ingreso biométrico activado correctamente!');
                            }
                        } catch (e) {
                            this.toastCtrl.danger('No se pudo activar la biometría.');
                        } finally {
                            this.router.navigate(['/login/disclaimer']);
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    navigateTo(link) {
        const https = 'https://';
        const http = 'http://';
        if (link.startsWith(https) || link.startsWith(http)) {
            this.iab.create(link);
        } else {
            this.iab.create(`http://${link}`);
        }
    }
}
