import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteProvider } from 'src/providers/paciente';
import { AuthProvider } from 'src/providers/auth/auth';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { DeviceProvider } from 'src/providers/auth/device';
import { ENV } from 'src/environments/environment';
import { BarcodeScannerService } from 'src/providers/library-services/barcode-scanner.service';
@Component({
    selector: 'app-informacion-validacion',
    templateUrl: 'informacion-validacion.html',
})
export class InformacionValidacionPage implements OnInit {

    loading: any;
    modelo: any = {};
    info: any;
    paciente: any = {};
    public textoLibre: string = null;
    public formRegistro: any;
    public infoNrotramite = false;
    public infoScan = false;
    public showAccountInfo = false;
    accountNombre: any;
    public scanValido = false;
    public pacienteValido = true;
    public email = ENV.EMAIL;
    public scanButtonLabel = 'Escanear mi DNI';
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private platform: Platform,
        public toastController: ToastController,
        public alertController: AlertController,
        private pacienteProvider: PacienteProvider,
        private barcodeScannerService: BarcodeScannerService,
        private device: DeviceProvider) {
    }

    ngOnInit(): void {
        const emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$';
        const patronDocumento = '^[1-9]{1}[0-9]{4,7}$';
        const patronContactoNumerico = '^[0-9]{3}[0-9]{6,7}$';
        this.formRegistro = this.formBuilder.group({
            scanText: ['', Validators.compose([Validators.required])],
            apellido: ['', Validators.compose([Validators.required])],
            nombre: ['', Validators.compose([Validators.required])],
            documento: ['', Validators.compose([Validators.required, Validators.pattern(patronDocumento)])],
            celular: ['', Validators.compose([Validators.required, Validators.pattern(patronContactoNumerico)])],
            email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
            sexo: ['', Validators.compose([Validators.required])],
            recaptcha: ['', Validators.compose([Validators.required])]
        });
        // Iniciar FCM sólo si es un dispositivo
        if (this.platform.is('mobile') || this.platform.is('tablet')) {
            this.device.getToken().then(token => {
                this.paciente.fcmToken = token;
            });
        }

    }

    trimEmail(value) {
        this.formRegistro.patchValue({
            email: value.replace(/\s/g, '').toLowerCase()
        });
    }

    public cancel() {
        this.router.navigate(['/login']);
    }

    registrarUsuario() {
        this.loading = true;
        this.paciente.scanText = this.formRegistro.controls.scanText.value.text;
        this.paciente.documento = this.formRegistro.controls.documento.value;
        this.paciente.sexo = this.formRegistro.controls.sexo.value;
        this.paciente.telefono = this.formRegistro.controls.celular.value;
        this.paciente.email = this.formRegistro.controls.email.value;
        this.paciente.recaptcha = this.formRegistro.controls.recaptcha.value;
        this.paciente.scan = this.scanValido;

        this.pacienteProvider.registro(this.paciente).then(async (resultado: any) => {
            if (resultado._id) {
                this.loading = false;
                await this.cuentaCreadaToast();
                setTimeout(() => {
                    this.accountNombre = `${resultado.apellido}, ${resultado.nombre}`;
                    this.showAccountInfo = true;
                }, 2000);
            }
        }).catch(async (err) => {
            this.showAccountInfo = false;
            this.loading = false;
            if (err.error._body === 'No es posible verificar su identidad.') {
                await this.errorRenaperModal();
            } else {
                await this.errorValidacionToast(err);

            }
        });
        this.cleanCaptcha();
    }

    private async cuentaCreadaToast() {
        const toast = await this.toastController.create({
            message: 'Su cuenta ha sido creada con éxito.',
            duration: 5000,
            color: 'success'
        });
        await toast.present();
    }

    private async errorValidacionToast(err: any) {
        const toast = await this.toastController.create({
            message: err.error._body,
            duration: 5000,
            color: 'danger'
        });
        await toast.present();
    }

    private async errorRenaperModal() {
        const confirm = await this.alertController.create({
            header: 'No es posible registrarse',
            message: 'Por un problema en el Registro Nacional de las Personas, temporalmente no es posible validar pacientes. Disculpe las molestias.',
            buttons: [
                {
                    text: 'Cerrar',
                    handler: () => {
                        // resolve();
                    }
                }
            ]
        });
        await confirm.present();
    }

    addContacto(key, value) {
        const index = this.paciente.contacto.findIndex(item => item.tipo === key);
        if (index >= 0) {
            return this.paciente.contacto[index].valor = value;
        } else {
            const nuevo = {
                tipo: key,
                valor: value,
                ranking: 1,
                activo: true,
                ultimaActualizacion: new Date()
            };
            this.paciente.contacto.push(nuevo);
        }
    }

    cleanCaptcha() {
        this.formRegistro.controls.recaptcha.reset();
    }

    get nombreApellido() {
        return `${this.formRegistro.get('apellido').value}, ${this.formRegistro.get('nombre').value}`;
    }
    get documento() {
        return this.formRegistro.get('documento').value;
    }

    get sexo() {
        return this.formRegistro.get('sexo').value;
    }

    get celular() {
        return this.formRegistro.get('celular');
    }

    get buttonLabel() {
        return this.scanButtonLabel;
    }

    showInfoScan() {
        this.infoScan = !this.infoScan;
    }

    async scanner() {
        const result = await this.barcodeScannerService.scannerInformacion(this.formRegistro);
        this.formRegistro = result.formRegistro;
        if (result.valid) {
            this.scanButtonLabel = 'Volver a escanear mi DNI';
            this.scanValido = true;
        } else {
            this.scanValido = false;
        }
    }

    private async chequeaPaciente(documento) {
        this.pacienteProvider.getPacienteApp(documento).then(async (result: any) => {
            const pacienteActivo = result.find((paciente: any) => paciente.activacionApp);
            const maskedEmail = this.maskEmail(pacienteActivo?.email);

            if (!result) {
                this.pacienteValido = false;
                this.scanValido = false;
            }
            if (pacienteActivo) {
                this.pacienteValido = false;
                this.scanValido = false;
                const confirm = await this.alertController.create({
                    header: 'Cuenta existente',
                    message: `<p>Los datos del paciente escaneado ya tienen asociado una cuenta con el mail <b>${maskedEmail}`,
                    buttons: [
                        {
                            text: 'Ir a Login',
                            handler: () => {
                                this.router.navigateByUrl('/login');
                            }
                        },
                        {
                            text: 'Editar email',
                            handler: () => {
                                this.pacienteValido = true;
                                this.scanValido = true;
                            }
                        }
                    ]
                });
                await confirm.present();
            }
            if (!pacienteActivo && result) {
                this.pacienteValido = false;
                this.scanValido = false;
                const confirm = await this.alertController.create({
                    header: 'Cuenta inactiva',
                    message: `<p>Los datos del paciente escaneado tienen una cuenta de mail inactiva <b>${maskedEmail}`,
                    buttons: [
                        {
                            text: 'Activar mail',
                            handler: () => {
                                this.pacienteValido = true;
                                this.scanValido = true;

                                // Redirigir a login con el parámetro de activación.
                                this.router.navigate(['/login', { activacion: true }]);
                            }
                        }
                    ]
                });
                await confirm.present();
            }
        }, (err) => {
            console.error(err);
        });


    }

    maskEmail(email: string): string {
        if (email) {
            const [localPart, domain] = email.split('@'); // Separar parte local y dominio
            if (localPart.length > 3) {
                // Mostrar los primeros 3 caracteres de la parte local y luego ocultar el resto
                return `${localPart.slice(0, 3)}****@${domain}`;
            }
            // En caso de que la parte local sea muy corta, devolver solo los asteriscos
            return `***@${domain}`;
        } else {
            return '';
        }

    }

    cleanScan() {
        this.formRegistro.controls.sexo.setValue('');
        this.formRegistro.controls.documento.setValue('');
        this.formRegistro.controls.apellido.setValue('');
        this.formRegistro.controls.nombre.setValue('');
        this.formRegistro.controls.scanText.setValue('');
        this.formRegistro.get('recaptcha').setValidators([Validators.required]);
        this.formRegistro.get('recaptcha').updateValueAndValidity();
        this.scanValido = false;

    }



}
