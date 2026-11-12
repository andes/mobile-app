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


    /**
     * @param verificarCuenta se ejecuta antes de pedir el sexo; si devuelve false se corta el escaneo
     */
    async scannerInformacion(form: FormGroup, verificarCuenta?: (documento: string) => Promise<boolean>) {
        try {
            const options = configScan.setOptions();
            const barcodeData: BarcodeScanResult = await this.barcodeScanner.scan(options);

            const datos = this.scanParser.scan(barcodeData.text);
            if (datos && verificarCuenta && !(await verificarCuenta(datos.documento))) {
                return { formRegistro: form, valid: false };
            }
            if (datos && !(await this.completarSexo(datos))) {
                return { formRegistro: form, valid: false };
            }
            if (datos) {

                form.controls.scanText.setValue(barcodeData);
                form.controls.apellido.setValue(datos.apellido);
                form.controls.nombre.setValue(datos.nombre);
                form.controls.documento.setValue(datos.documento);
                form.controls.sexo.setValue(datos.sexo);
                if (form.controls.tramite) {
                    form.controls.tramite.setValue(datos.tramite);
                }
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
        return { formRegistro: form, valid: false };
    }

    async scannerDocument(form: FormGroup) {
        try {
            const options = configScan.setOptions();
            const barcodeData: BarcodeScanResult = await this.barcodeScanner.scan(options);

            const datos = this.scanParser.scan(barcodeData.text);
            if (datos && !(await this.completarSexo(datos))) {
                this.scanValido = false;
                return { formRegistro: form, scanValido: false };
            }
            if (datos) {

                form.controls.scanText.setValue(barcodeData);
                form.controls.apellido.setValue(datos.apellido);
                form.controls.nombre.setValue(datos.nombre);
                form.controls.documento.setValue(datos.documento);
                form.controls.sexo.setValue(datos.sexo);
                if (form.controls.tramite) {
                    form.controls.tramite.setValue(datos.tramite);
                }
                this.scanValido = this.scanParser.isValid(barcodeData.text);
            } else {
                this.toastCtrl.danger('Documento inválido.');
            }
        } catch (error) {
            await this.toastCtrl.danger('Error al escanear el documento.');
        }
        return {
            formRegistro: form,
            scanValido: this.scanValido
        };
    }

    /**
     * @param sexoUsuario sexo del profesional logueado: si el documento no lo informa se usa este en lugar de pedirlo
     */
    scannerProfesional(sexoUsuario?: string) {
        const options = configScan.setOptions();

        this.barcodeScanner.scan(options).then(
            async (barcodeData) => {
                const datos = this.scanParser.scan(barcodeData.text);
                if (datos && !datos.sexo && sexoUsuario) {
                    datos.sexo = sexoUsuario.charAt(0).toUpperCase() + sexoUsuario.slice(1).toLowerCase();
                    datos.genero = datos.sexo;
                }
                if (datos && !(await this.completarSexo(datos))) {
                    return;
                }
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


    /**
     * El DNI 2026 (y el acta de nacimiento) no informan el sexo, que es necesario para validar con RENAPER:
     * se le pide al usuario. Devuelve false si no lo selecciona.
     */
    private async completarSexo(datos): Promise<boolean> {
        if (datos.sexo) {
            return true;
        }
        const alert = await this.alertCtrl.create({
            header: 'Seleccione el sexo',
            message: 'El documento escaneado no informa el sexo. Seleccione el sexo con el que está registrada la persona.',
            inputs: [
                { type: 'radio', label: 'Femenino', value: 'Femenino' },
                { type: 'radio', label: 'Masculino', value: 'Masculino' },
                { type: 'radio', label: 'Otro', value: 'Otro' }
            ],
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                // Sin selección el alert queda abierto
                { text: 'Aceptar', handler: (valor) => !!valor }
            ]
        });
        await alert.present();
        const { data, role } = await alert.onDidDismiss();
        const sexo = role === 'cancel' ? null : data?.values;
        if (!sexo) {
            await this.toastCtrl.danger('Debe seleccionar el sexo para continuar.');
            return false;
        }
        datos.sexo = sexo;
        datos.genero = sexo;
        return true;
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
