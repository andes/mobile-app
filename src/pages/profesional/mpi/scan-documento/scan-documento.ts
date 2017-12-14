import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { DocumentoEscaneados } from '../regex-documento-scan';

// providers
import { AuthProvider } from '../../../../providers/auth/auth';
import { ScanParser } from '../../../../providers/scan-parser';
import { RegistroPacientePage } from '../registro-paciente/registro-paciente';

@Component({
  selector: 'page-scan-documento',
  templateUrl: 'scan-documento.html',
})
export class ScanDocumentoPage implements OnInit {

  loading: any;
  mostrarMenu: boolean = true;
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
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
  }

  scanner() {
    this.barcodeScanner.scan(
      {
        preferFrontCamera: false,
        formats: "QR_CODE,PDF_417",
        disableSuccessBeep: false,
        showTorchButton: true,
        torchOn: true,
        prompt: "Poner el código de barra en la cámara",
        resultDisplayDuration: 500,
      }

    ).then((barcodeData) => {
        let datos = this.scanParser.scan(barcodeData.text);

        this.navCtrl.push(RegistroPacientePage, {datos, scan: barcodeData.text});

        console.log(datos);
 
    }, (err) => {

    });
  }
}
