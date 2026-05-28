import { Component, OnInit } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { DeviceProvider } from 'src/providers/auth/device';
import { ToastProvider } from 'src/providers/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BiometricService } from 'src/providers/auth/biometric';

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
    biometricAvailable = false;
    biometricActive = false;
    hasCredentials = false;

    constructor(
        public authService: AuthProvider,
        private toastCtrl: ToastProvider,
        private deviceProvider: DeviceProvider,
        private router: Router,
        private route: ActivatedRoute,
        private biometricService: BiometricService,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['activacion']) {
                this.activar();
            }
        });
    }

    public login(navigate = true) {
        if (!this.email || !this.password) {
            this.toastCtrl.danger('Complete los datos para ingresar.');
            return Promise.reject();
        }
        this.email = this.email.toLocaleLowerCase();
        if (this.emailRegex.test(this.email)) {
            // Login pacientes
            this.loading = true;
            const credentials = {
                email: this.email,
                password: this.password
            };
            return this.authService.login(credentials).then(async (result: any) => {
                this.loading = false;
                this.deviceProvider.sync();

                const puedeMostrarMensaje = await this.biometricService.puedeMostrarMensaje('paciente');

                if (puedeMostrarMensaje) {
                    this.promptActivarBiometria(navigate);
                } else {
                    this.router.navigateByUrl('/home/paciente');
                }
                return result;
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
                throw err;
            });
        } else {
            this.toastCtrl.danger('Credenciales incorrectas');
            return Promise.reject();
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

    async ionViewWillEnter() {
        this.email = '';
        this.password = '';
        this.biometricAvailable = await this.biometricService.estaDisponible();
        this.biometricActive = await this.biometricService.biometriaActivadaPorUsuario('paciente');
        const creds = await this.biometricService.obtenerCredencialesSeguras('paciente');
        this.hasCredentials = !!creds;
    }

    async alternarBiometria() {
        if (this.biometricActive) {
            await this.biometricService.desactivarBiometria('paciente');
            this.biometricActive = false;
            this.toastCtrl.success('Ingreso biométrico desactivado.');
        } else {
            if (!this.email || !this.password) {
                this.toastCtrl.danger('Ingrese su usuario y contraseña para activar la biometría.');
                return;
            }
            try {
                // Intentamos login para validar credenciales
                await this.login(false);
                // Forzamos el prompt si no está activo, ya que el usuario pulsó "Activar"
                const yaActivado = await this.biometricService.biometriaActivadaPorUsuario('paciente');
                if (!yaActivado) {
                    await this.promptActivarBiometria(true);
                }
            } catch (e) {
                // Error manejado en login()
            }
        }
    }

    async loginBiometrico() {
        const credenciales = await this.biometricService.obtenerCredencialesSeguras('paciente');
        if (credenciales) {
            // SEGURIDAD: Si ya escribió un email, validamos que coincida con el de la biometría
            if (this.email && this.email.toLowerCase() !== credenciales.usuario.toLowerCase()) {
                this.toastCtrl.danger('La biometría guardada no coincide con el usuario ingresado.');
                return;
            }

            const verificado = await this.biometricService.autenticar();
            if (verificado) {
                this.loading = true;
                this.authService.login({
                    email: credenciales.usuario,
                    password: credenciales.clave
                }).then(() => {
                    this.loading = false;
                    this.deviceProvider.sync();
                    this.router.navigateByUrl('/home/paciente');
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
                        await this.biometricService.marcarComoRechazado(true, 'paciente');
                        // SIEMPRE navegamos porque el login ya fue exitoso
                        this.router.navigateByUrl('/home/paciente');
                    }
                },
                {
                    text: 'Activar',
                    handler: async () => {
                        try {
                            const verificado = await this.biometricService.autenticar();
                            if (verificado) {
                                await this.biometricService.guardarCredencialesSeguras(this.email, this.password, 'paciente');
                                this.toastCtrl.success('¡Ingreso biométrico activado correctamente!');
                                this.biometricActive = true;
                            }
                        } catch (e) {
                            this.toastCtrl.danger('No se pudo activar la biometría.');
                        } finally {
                            // SIEMPRE navegamos porque el login ya fue exitoso
                            this.router.navigateByUrl('/home/paciente');
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

}
