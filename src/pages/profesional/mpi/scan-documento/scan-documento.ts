import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { DocumentoEscaneados } from '../regex-documento-scan';

// providers
import { AuthProvider } from '../../../../providers/auth/auth';
import { ScanParser } from '../../../../providers/scan-parser';
import { RegistroPacientePage } from '../registro-paciente/registro-paciente';
import { ToastProvider } from '../../../../providers/toast';

@Component({
    selector: 'page-scan-documento',
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
        public storage: Storage,
        public authService: AuthProvider,
        private barcodeScanner: BarcodeScanner,
        public navCtrl: NavController,
        public scanParser: ScanParser,
        private toastCtrl: ToastProvider,
        public navParams: NavParams) {

    }

    ionViewDidLoad() {
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
            let datos = this.scanParser.scan(barcodeData.text);
            if (datos) {
                this.navCtrl.push(RegistroPacientePage, { datos, scan: barcodeData.text });
            } else {
                this.toastCtrl.danger('Documento invalido');
            }

        }, (err) => {

        });
    }
}
