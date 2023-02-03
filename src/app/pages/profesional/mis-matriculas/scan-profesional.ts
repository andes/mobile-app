import { AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ScanParser } from 'src/providers/scan-parser';
import { ToastProvider } from 'src/providers/toast';
import { Router } from '@angular/router';
import * as configScan from 'src/providers/config-scan';

@Component({
    selector: 'app-scan-profesional',
    templateUrl: 'scan-profesional.html',
})
export class ScanProfesionalPage {

    loading: any;
    modelo: any = {};
    info: any;

    public textoLibre: string = null;

    constructor(
        private router: Router,
        private barcodeScanner: BarcodeScanner,
        private scanParser: ScanParser,
        private toastCtrl: ToastProvider,
        private alertCtrl: AlertController) {
    }

    scanner() {
        const options = configScan.setOptions();
        this.barcodeScanner.scan(options).then((barcodeData) => {
            const datos = this.scanParser.scan(barcodeData.text);
            if (datos) {
                this.router.navigate(['profesional/datos-profesional'],
                    { queryParams: { datos: JSON.stringify(datos) } });
            } else {
                this.toastCtrl.danger('Documento inválido.');
            }
        }, (err) => {
            this.scanFail(err);
        });
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
