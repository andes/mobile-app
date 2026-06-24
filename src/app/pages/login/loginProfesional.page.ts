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
    biometricActive = false;
    hasCredentials = false;

    constructor(
        public authService: AuthProvider,
        private toastCtrl: ToastProvider,
        private deviceProvider: DeviceProvider,
        private iab: InAppBrowser,
        private router: Router,
        private biometricService: BiometricService,
        private alertCtrl: AlertController
    ) { }

    public login(navigate = true) {
        if (!this.documento || !this.password) {
            this.toastCtrl.danger('Complete los datos para ingresar.');
            return Promise.reject();
        }
        if (this.dniRegex.test(this.documento)) {
            // Login profesional
            const credenciales = {
                usuario: this.documento,
                password: this.password,
                mobile: true,
            };
            this.loading = true;
            return this.authService.loginProfesional(credenciales).then(async (resultado) => {
                this.loading = false;
                this.deviceProvider.sync();

                const puedeMostrarMensaje = await this.biometricService.puedeMostrarMensaje('profesional');

                if (puedeMostrarMensaje) {
                    this.promptActivarBiometria(navigate);
                } else {
                    this.router.navigate(['/login/disclaimer']);
                }
                return resultado;
            })
                .catch((err) => {
                    this.loading = false;
                    this.toastCtrl.danger('Credenciales incorrectas');
                    throw err;
                });
        } else {
            this.toastCtrl.danger('Credenciales incorrectas');
            return Promise.reject();
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
        this.documento = '';
        this.password = '';
        this.biometricAvailable = await this.biometricService.estaDisponible();
        this.biometricActive = await this.biometricService.biometriaActivadaPorUsuario('profesional');
        const creds = await this.biometricService.obtenerCredencialesSeguras('profesional');
        this.hasCredentials = !!creds;
    }

    async alternarBiometria() {
        if (this.biometricActive) {
            await this.biometricService.desactivarBiometria('profesional');
            this.biometricActive = false;
            this.toastCtrl.success('Ingreso biométrico desactivado.');
        } else {
            if (!this.documento || !this.password) {
                this.toastCtrl.danger('Ingrese su usuario y contraseña para activar la biometría.');
                return;
            }
            try {
                // Intentamos login para validar credenciales
                await this.login(false);
                // Si el login fue exitoso y no se navegó (navigate=false),
                // forzamos el prompt de activación ya que el usuario pulsó "Activar" explícitamente.
                const yaActivado = await this.biometricService.biometriaActivadaPorUsuario('profesional');
                if (!yaActivado) {
                    await this.promptActivarBiometria(true); // El true aquí hará que navegue al terminar
                }
            } catch (e) {
                // Error manejado en login()
            }
        }
    }

    async loginBiometrico() {
        const credenciales = await this.biometricService.obtenerCredencialesSeguras('profesional');
        if (credenciales) {
            // SEGURIDAD: Si ya escribió un DNI, validamos que coincida con el de la biometría
            if (this.documento && String(this.documento) !== String(credenciales.usuario)) {
                this.toastCtrl.danger('La biometría guardada no coincide con el usuario ingresado.');
                return;
            }

            const verificado = await this.biometricService.autenticar();
            if (verificado) {
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
            }
        } else {
            this.toastCtrl.danger('No hay biometría configurada para este perfil.');
        }
    }

    async promptActivarBiometria(navigate = true) {
        const alert = await this.alertCtrl.create({
            header: 'Acceso Rápido y Seguro',
            message: '¿Deseas activar el ingreso con reconocimiento facial o dactilar para ingresar más rápido, sin escribir tu contraseña?',
            buttons: [
                {
                    text: 'Ahora no',
                    role: 'cancel',
                    handler: async () => {
                        await this.biometricService.marcarComoRechazado(true, 'profesional');
                        // SIEMPRE navegamos porque el login ya fue exitoso
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
                                this.biometricActive = true;
                            }
                        } catch (e) {
                            this.toastCtrl.danger('No se pudo activar la biometría.');
                        } finally {
                            // SIEMPRE navegamos porque el login ya fue exitoso
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
