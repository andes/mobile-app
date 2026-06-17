import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteProvider } from 'src/providers/paciente';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { DeviceProvider } from 'src/providers/auth/device';
import { ENV } from 'src/environments/environment';
import { BarcodeScannerService } from 'src/providers/library-services/barcode-scanner.service';
@Component({
    selector: 'app-informacion-validacion',
    templateUrl: 'informacion-validacion.html',
    styleUrls: ['informacion-validacion.scss']
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
    public pacienteValido = false;
    public mostrarConfirmarEmail = false;
    private lastValue = '';
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
            confirmarEmail: [{ value: '', disabled: true }, Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
            sexo: ['', Validators.compose([Validators.required])],
            recaptcha: ['', Validators.compose([Validators.required])]
        }, { validators: this.emailsMatchValidator() });

        this.formRegistro.get('email').statusChanges.subscribe(status => {
            const ctrlConfirmar = this.formRegistro.get('confirmarEmail');
            if (status === 'VALID') {
                ctrlConfirmar.enable();
            } else {
                ctrlConfirmar.disable();
                ctrlConfirmar.setValue('');
                this.lastValue = '';
            }
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

    trimConfirmarEmail(value) {
        this.formRegistro.patchValue({
            confirmarEmail: value.replace(/\s/g, '').toLowerCase()
        });
    }

    onInputConfirmarEmail(event: any) {
        const newValue = event.target.value;
        const inputType = event.inputType;

        const isManual = inputType === 'insertText' || inputType === 'insertCompositionText' || inputType?.startsWith('delete');

        if (!isManual || (newValue.length > this.lastValue.length + 2)) {
            event.target.value = this.lastValue;
            this.formRegistro.get('confirmarEmail').setValue(this.lastValue);
            return;
        }

        this.lastValue = newValue;
        this.trimConfirmarEmail(newValue);
    }

    emailsMatchValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const email = group.get('email')?.value || '';
            const confirmar = group.get('confirmarEmail')?.value || '';
            if (email && confirmar && email !== confirmar) {
                return { emailsNoCoinciden: true };
            }
            return null;
        };
    }

    get emailNoCoincide(): boolean {
        const confirmarCtrl = this.formRegistro.get('confirmarEmail');
        return this.formRegistro.hasError('emailsNoCoinciden') &&
            (confirmarCtrl?.dirty || confirmarCtrl?.touched);
    }

    get confirmarEmailRequerido(): boolean {
        const ctrl = this.formRegistro.get('confirmarEmail');
        return ctrl.getError('required') && (ctrl.dirty || ctrl.touched);
    }

    get confirmarEmailFormatoInvalido(): boolean {
        const ctrl = this.formRegistro.get('confirmarEmail');
        return ctrl.getError('pattern') && (ctrl.dirty || ctrl.touched);
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
            if (err.code !== null && err.message !== null) {
                await this.errorModal('', err.message);
            } else {
                await this.errorModal('Error', 'Ha ocurrido un error inesperado. Por favor, intente nuevamente.');
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

    private async errorModal(titulo: string, mensaje: string) {
        const confirm = await this.alertController.create({
            header: titulo,
            message: mensaje,
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
            this.chequeaPaciente(this.documento);
            this.scanValido = true;
            this.scanButtonLabel = 'Volver a escanear mi DNI';
        } else {
            this.scanValido = false;
        }
    }

    private async chequeaPaciente(documento) {
        this.pacienteProvider.getPacienteApp(documento).then(async (result: any[]) => {

            const resultados = result?.filter(p => !p.profesionalId);
            if (!resultados.length) {
                this.pacienteValido = true;
                return;
            } else {
                const pacienteActivo = resultados.find(p => p.activacionApp === true);
                const pacienteInactivo = resultados.find(p => p.activacionApp === false);

                this.pacienteValido = false;
                this.scanValido = false;
                let maskedEmail;
                let confirm;

                if (pacienteActivo) {
                    maskedEmail = this.maskEmail(pacienteActivo.email);

                    confirm = await this.alertController.create({
                        header: 'Cuenta existente',
                        message: `<p>El paciente escaneado ya posee una cuenta asociada con el email <b>${maskedEmail}</b>.
                      Si olvidó su contraseña, puede recuperarla desde la pantalla de login.</p>`,
                        buttons: [{
                            text: 'Ir a Login',
                            handler: () => this.router.navigateByUrl('/login')
                        }]
                    });
                    await confirm.present();
                } else if (pacienteInactivo) {
                    maskedEmail = this.maskEmail(pacienteInactivo.email);

                    confirm = await this.alertController.create({
                        header: 'Cuenta inactiva',
                        message: `<p>El paciente escaneado ya posee una cuenta asociada al email <b>${maskedEmail}</b> pero está inactiva.
                      ¿Desea activarla ahora?</p>`,
                        buttons: [{
                            text: 'Activar email',
                            handler: () => this.router.navigate(['/login', { activacion: true }])
                        }]
                    });
                    await confirm.present();
                } else {
                    this.pacienteValido = true;
                    this.scanValido = true;
                }
            }
        },
            (err) => {
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
