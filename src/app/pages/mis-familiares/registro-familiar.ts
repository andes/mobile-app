import { AuthProvider } from 'src/providers/auth/auth';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastProvider } from 'src/providers/toast';
import { PacienteProvider } from 'src/providers/paciente';
import { ToastController } from '@ionic/angular';
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
    public textoLibre: string = null;
    public formRegistro: any;
    public infoNrotramite = false;
    public scanValido = false;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private toastCtrl: ToastProvider,
        public toastController: ToastController,
        private pacienteProvider: PacienteProvider,
        private auth: AuthProvider,
        private barcodeScanner: BarcodeScanner,
        private scanParser: ScanParser) {
    }

    ngOnInit(): void {
        const patronDocumento = '^[1-9]{1}[0-9]{4,7}$';
        this.userId = this.auth.user.pacientes[0].id;
        this.formRegistro = this.formBuilder.group({
            documento: ['', Validators.compose([Validators.required, Validators.pattern(patronDocumento)])],
            tramite: ['', Validators.compose([Validators.required])],
            sexo: ['', Validators.compose([Validators.required])]
        });
    }

    public cancel() {
        this.router.navigate(['/mis-familiares']);
    }

    registrarFamiliar() {
        this.loading = true;
        this.familiar.documento = this.formRegistro.controls.documento.value;
        this.familiar.sexo = this.formRegistro.controls.sexo.value;
        this.familiar.tramite = this.formRegistro.controls.tramite.value;
        this.familiar.scan = this.scanValido;
        this.pacienteProvider.registroFamiliar(this.userId, this.familiar).then(async (resultado: any) => {
            if (resultado._id) {
                this.loading = false;
                const toast = await this.toastController.create({
                    message: 'Hijo asociado con éxito.',
                    duration: 5000,
                    color: 'success'
                });
                await toast.present();
                this.router.navigate(['/mis-familiares']);
            }
        }).catch(async (err) => {
            this.loading = false;
            const toast = await this.toastController.create({
                message: err.error._body,
                duration: 5000,
                color: 'danger'
            });
            await toast.present();
        });
    }

    infoNT() {
        this.infoNrotramite = !this.infoNrotramite;
    }

    scanner() {
        const options = configScan.setOptions();
        this.barcodeScanner.scan(options).then((barcodeData) => {
            const datos = this.scanParser.scan(barcodeData.text);
            if (datos) {
                this.formRegistro.controls.sexo.setValue(datos.sexo.toLowerCase());
                this.formRegistro.controls.documento.setValue(datos.documento);
                this.formRegistro.controls.tramite.setValue(datos.tramite);
                this.scanValido = true;
            } else {
                this.toastCtrl.danger('Documento invalido');
            }
        }, (err) => {
        });
    }

    cleanScan() {
        this.formRegistro.controls.sexo.setValue('');
        this.formRegistro.controls.documento.setValue('');
        this.scanValido = false;

    }

}
