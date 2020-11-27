import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

// providers
import { AuthProvider } from 'src/providers/auth/auth';
import { ScanParser } from 'src/providers/scan-parser';
import { ToastProvider } from 'src/providers/toast';
import { Router } from '@angular/router';

@Component({
    selector: 'app-scan-documento',
    templateUrl: 'scan-documento.html',
})
export class ScanDocumentoPage implements OnInit {

    loading: any;
    modelo: any = {};
    info: any;

    public textoLibre: string = null;

    ngOnInit() {

    }

    constructor(
        public router: Router,
        public storage: Storage,
        public authService: AuthProvider,
        private barcodeScanner: BarcodeScanner,
        public navCtrl: NavController,
        public scanParser: ScanParser,
        private toastCtrl: ToastProvider,
        public navParams: NavParams) {

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
            // let barcodeData = {text: '10523200219632599@BOTTA@MARIANO ANDRES@M@34934522@A@09/03/1990@27/09/2013'}
            const datos = this.scanParser.scan(barcodeData.text);
            if (datos) {
                console.log('scan ', barcodeData.text);
                this.router.navigate(['profesional/registro-paciente'],
                { queryParams: { datos: JSON.stringify(datos), scan:  barcodeData.text}});
            } else {
                this.toastCtrl.danger('Documento invalido');
            }

        }, (err) => {

        });
    }
}
