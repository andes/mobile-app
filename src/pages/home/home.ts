import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

// import * as config from './config';
// import * as http from 'http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private barcodeScanner: BarcodeScanner, public navCtrl: NavController) {

  }

  // loginApp(datos: any) {
  //   return new Promise((resolve, reject) => {
  //     let options = {
  //       host: config.hostApi,
  //       port: config.portApi,
  //       path: '/api/auth/login',
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       }
  //     };
  //     let req = http.request(options, function (res) {
  //       res.on('data', function (body) {
  //         resolve(JSON.parse(body.toString()));
  //       });
  //     });
  //     req.on('error', function (e) {
  //       console.log('Problemas API : ' + e.message + ' ----- ', e);
  //       reject(e.message);
  //     });
  //     req.write(JSON.stringify(datos));
  //     req.end();
  //   });
  // }
  
}
