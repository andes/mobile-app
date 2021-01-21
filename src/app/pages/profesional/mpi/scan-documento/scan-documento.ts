import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// providers
import { ScanParser } from 'src/providers/scan-parser';
import { ToastProvider } from 'src/providers/toast';
import { Router } from '@angular/router';

@Component({
    selector: 'app-scan-documento',
    templateUrl: 'scan-documento.html',
})
export class ScanDocumentoPage {

    loading: any;
    modelo: any = {};
    info: any;

    public textoLibre: string = null;

    constructor(
        private router: Router,
        private barcodeScanner: BarcodeScanner,
        private scanParser: ScanParser,
        private toastCtrl: ToastProvider) {
    }

    scanner() {
        this.barcodeScanner.scan(
            {
                preferFrontCamera: false,
                formats: 'QR_CODE,PDF_417',
                disableSuccessBeep: false,
                showTorchButton: true,
                torchOn: true,
                prompt: 'Poner el código de barra en la cámara',
                resultDisplayDuration: 500,
            }

        ).then((barcodeData) => {
            const datos = this.scanParser.scan(barcodeData.text);
            if (datos) {
                console.log('scan ', barcodeData.text);
                this.router.navigate(['profesional/registro-paciente'],
                    { queryParams: { datos: JSON.stringify(datos), scan: barcodeData.text } });
            } else {
                this.toastCtrl.danger('Documento invalido');
            }

        }, (err) => {

        });
    }
}
