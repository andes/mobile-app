import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { AuthProvider } from '../../providers/auth/auth';
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

  loading: any;

  constructor(public loadingCtrl: LoadingController, public authService: AuthProvider, private barcodeScanner: BarcodeScanner, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EscanerDniPage');

    this.showLoader();

    // Check if already authenticated
    this.authService.checkAuthentication().then((res) => {
      console.log("Ya está autorizado");
      this.loading.dismiss();      
    }, (err) => {
      console.log("No está autorizado");
      this.loading.dismiss();
      this.navCtrl.push(LoginPage);
    });
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
      alert("Codigoo: " + barcodeData.text + ' - ' + barcodeData.format);
    }, (err) => {
      // An error occurred
    });
  }

  showLoader() {

    this.loading = this.loadingCtrl.create({
      content: 'Autenticando...'
    });

    this.loading.present();
  }
}
