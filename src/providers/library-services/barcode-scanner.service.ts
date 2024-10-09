import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScanResult } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ScanParser } from 'src/providers/scan-parser';
import * as configScan from 'src/providers/config-scan';
import { FormGroup } from '@angular/forms';
import { ToastProvider } from '../toast';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class BarcodeScannerService {

    scanValido = false;
    constructor(private barcodeScanner: BarcodeScanner,
                private scanParser: ScanParser,
                private toastCtrl: ToastProvider,
                private router: Router,
                private alertCtrl: AlertController
    ) { }


    async scannerInformacion(form: FormGroup) {
        try {
            const options = configScan.setOptions();
            const barcodeData: BarcodeScanResult = await this.barcodeScanner.scan(options);

            const datos = this.scanParser.scan(barcodeData.text);
            if (datos) {

                form.controls.scanText.setValue(barcodeData);
                form.controls.apellido.setValue(datos.apellido);
                form.controls.nombre.setValue(datos.nombre);
                form.controls.documento.setValue(datos.documento);
                form.controls.sexo.setValue(datos.sexo);
                form.get('recaptcha').setValidators(null);
                form.get('recaptcha').updateValueAndValidity();
                return {
                    formRegistro: form,
                    valid: this.scanParser.isValid(barcodeData.text),
                    message: 'Documento escaneado correctamente.'
                };
            } else {
                this.toastCtrl.danger('Documento inválido.');
            }
        } catch (error) {
            await this.toastCtrl.danger('Error al escanear el documento.');
        }
    }

    async scannerDocument(form: FormGroup) {
        try {
            const options = configScan.setOptions();
            const barcodeData: BarcodeScanResult = await this.barcodeScanner.scan(options);

            const datos = this.scanParser.scan(barcodeData.text);
            if (datos) {

                form.controls.scanText.setValue(barcodeData);
                form.controls.apellido.setValue(datos.apellido);
                form.controls.nombre.setValue(datos.nombre);
                form.controls.documento.setValue(datos.documento);
                form.controls.sexo.setValue(datos.sexo);
                this.scanValido = this.scanParser.isValid(barcodeData.text);
            } else {
                this.toastCtrl.danger('Documento inválido.');
            }
        } catch (error) {
            await this.toastCtrl.danger('Error al escanear el documento.');
        }
        return {
            formRegistro: form,
            scanValido:this.scanValido
        };
    }

    scannerProfesional() {
        const options = configScan.setOptions();

        this.barcodeScanner.scan(options).then(
            (barcodeData) => {
                const datos = this.scanParser.scan(barcodeData.text);
                if (datos) {
                    this.router.navigate(['profesional/datos-profesional'], {
                        queryParams: { datos: JSON.stringify(datos) },
                    });
                } else {
                    this.toastCtrl.danger('Documento inválido.');
                }
            },
            async (err) => {
                this.scanFail(err);
            }
        );
    }

    async scanFail(error) {
        const alert = await this.alertCtrl.create({
            header: 'No se pudo registrar al paciente',
            message: 'Hubo un problema al escanear el Documento. Por favor intente nuevamente.',
            buttons: [
                {
                    text: 'Aceptar',
                    handler: () => true
                }
            ]
        });

        await alert.present();
    }
}
