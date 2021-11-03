import { AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// providers
// import { ScanParser } from 'src/providers/scan-parser';
// import { ToastProvider } from 'src/providers/toast';
// import { Router } from '@angular/router';
// import * as configScan from 'src/providers/config-scan';

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
        // private router: Router,
        // private barcodeScanner: BarcodeScanner,
        // private scanParser: ScanParser,
        // private toastCtrl: ToastProvider,
        private alertCtrl: AlertController) {
    }

    async scanner() {

        const alert = await this.alertCtrl.create({
            header: 'Registro deshabilitado temporalmente',
            message: 'Por problemas con RENAPER el registro de pacientes nuevos está deshabilitado temporalmente.',
            buttons: [
                {
                    text: 'Aceptar',
                    handler: () => true
                }
            ]
        });

        await alert.present();

        // const options = configScan.setOptions();
        // this.barcodeScanner.scan(options).then((barcodeData) => {
        //     const datos = this.scanParser.scan(barcodeData.text);
        //     if (datos) {
        //         this.router.navigate(['profesional/registro-paciente'],
        //             { queryParams: { datos: JSON.stringify(datos), scan: barcodeData.text } });
        //     } else {
        //         this.toastCtrl.danger('Documento inválido.');
        //     }

        // }, (err) => {

        // });
    }
}
