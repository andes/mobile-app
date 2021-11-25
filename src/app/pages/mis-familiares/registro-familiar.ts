import { AuthProvider } from 'src/providers/auth/auth';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastProvider } from 'src/providers/toast';
import { PacienteProvider } from 'src/providers/paciente';
import { ToastController, AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ScanParser } from 'src/providers/scan-parser';
import * as configScan from 'src/providers/config-scan';
@Component({
    selector: 'app-registro-familiar',
    templateUrl: 'registro-familiar.html',
})

export class RegistroFamiliarPage implements OnInit {
    loading: any;
    modelo: any = {};
    info: any;
    familiar: any = {};
    userId;
    public scanButtonLabel = 'Escanear DNI';
    public textoLibre: string = null;
    public formRegistro: any;
    public scanValido = false;
    public showAccountInfo = false;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private toastCtrl: ToastProvider,
        public toastController: ToastController,
        private pacienteProvider: PacienteProvider,
        private auth: AuthProvider,
        private barcodeScanner: BarcodeScanner,
        private scanParser: ScanParser,
        public alertController: AlertController) {
    }

    ngOnInit(): void {
        const patronDocumento = '^[1-9]{1}[0-9]{4,7}$';
        this.userId = this.auth.user.pacientes[0].id;
        this.formRegistro = this.formBuilder.group({
            scanText: ['', Validators.compose([Validators.required])],
            apellido: ['', Validators.compose([Validators.required])],
            nombre: ['', Validators.compose([Validators.required])],
            documento: ['', Validators.compose([Validators.required, Validators.pattern(patronDocumento)])],
            tramite: ['', Validators.compose([Validators.required])],
            sexo: ['', Validators.compose([Validators.required])]
        });
    }

    public cancel() {
        this.router.navigate(['/mis-familiares']);
    }

    get buttonLabel() {
        return this.scanButtonLabel;
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

    registrarFamiliar() {
        this.loading = true;
        this.familiar.documento = this.formRegistro.controls.documento.value;
        this.familiar.sexo = this.formRegistro.controls.sexo.value;
        this.familiar.tramite = this.formRegistro.controls.tramite.value;
        this.familiar.scanText = this.formRegistro.controls.scanText.value.text;
        this.familiar.scan = this.scanValido;
        this.pacienteProvider.registroFamiliar(this.userId, this.familiar).then(async (resultado: any) => {
            if (resultado._id) {
                this.loading = false;
                const toast = await this.toastController.create({
                    message: 'Su hijo/a se asoció con éxito.',
                    duration: 5000,
                    color: 'success'
                });
                await toast.present();
                this.router.navigate(['/mis-familiares']);
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
    }

    private async errorRenaperModal() {
        const confirm = await this.alertController.create({
            header: 'No es posible registrar el familiar',
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

    private async errorValidacionToast(err: any) {
        const toast = await this.toastController.create({
            message: err.error._body,
            duration: 5000,
            color: 'danger'
        });
        await toast.present();
    }

    scanner() {
        const options = configScan.setOptions();
        this.barcodeScanner.scan(options).then((barcodeData) => {
            const datos = this.scanParser.scan(barcodeData.text);
            if (datos) {
                this.formRegistro.controls.sexo.setValue(datos.sexo.toLowerCase());
                this.formRegistro.controls.apellido.setValue(datos.apellido);
                this.formRegistro.controls.nombre.setValue(datos.nombre);
                this.formRegistro.controls.documento.setValue(datos.documento);
                this.formRegistro.controls.tramite.setValue(datos.tramite);
                this.formRegistro.controls.scanText.setValue(barcodeData);
                this.scanValido = this.scanParser.isValid(barcodeData.text);
            } else {
                this.toastCtrl.danger('Documento invalido');
            }
        }, (err) => {
        });
    }

    cleanScan() {
        this.formRegistro.controls.sexo.setValue('');
        this.formRegistro.controls.apellido.setValue('');
        this.formRegistro.controls.nombre.setValue('');
        this.formRegistro.controls.documento.setValue('');
        this.formRegistro.controls.tramite.setValue('');
        this.formRegistro.controls.scanText.setValue('');
        this.scanValido = false;
    }

}
