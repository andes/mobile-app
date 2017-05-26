import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the EscanerDniPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-escaner-dni',
  templateUrl: 'escaner-dni.html',
})
export class EscanerDniPage {

  constructor(private barcodeScanner: BarcodeScanner, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EscanerDniPage');
  }

  scanner() {

    this.barcodeScanner.scan(
      {
        preferFrontCamera: false,
        formats: "QR_CODE,PDF_417",
        disableSuccessBeep: false,
        showTorchButton: true,
        torchOn: true,
        prompt: "Place a barcode inside the scan area",
        resultDisplayDuration: 500,
      }

    ).then((barcodeData) => {

      // Success! Barcode data is here
      alert("Codigoo: " + barcodeData.text + ' - ' + barcodeData.format);
      // this.barcodeScanner.encode('PDF417', barcodeData).then((pepe) => {
      //   alert("Pepepepe : " + pepe);
      // })
    }, (err) => {
      // An error occurred
    });

  }

}
