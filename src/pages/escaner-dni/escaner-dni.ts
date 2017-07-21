import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as moment from 'moment/moment';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DatePicker } from '@ionic-native/date-picker';
import { Sim } from '@ionic-native/sim';
import { AuthProvider } from '../../providers/auth/auth';
import { RegistroPersonalDataPage } from '../registro/personal-data/personal-data';
import { RegistroUserDataPage } from '../registro/user-data/user-data';
import { Storage } from '@ionic/storage';
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
export class EscanerDniPage implements OnInit {

  loading: any;
  mostrarMenu: boolean = true;
  modelo: any = {};
  info: any;

  ngOnInit() {
  }

  constructor(public storage: Storage, private sim: Sim, private datePicker: DatePicker, public loadingCtrl: LoadingController, public authService: AuthProvider, private barcodeScanner: BarcodeScanner, public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    if ((window as any).cordova) {
      this.verSim();
    }
  }

  verSim() {
    this.sim.hasReadPermission().then(
      (info) => console.log('Has permission: ', info)
    );

    this.sim.requestReadPermission().then(
      () => {
        console.log('Permission granted')
        this.sim.getSimInfo().then(
          (info) => { this.info = info; console.log(info); },
          (err) => console.log('Unable to get sim info: ', err)
        );
      },
      () => console.log('Permission denied')
    );
  }

  toDatos() {
    this.navCtrl.push(RegistroPersonalDataPage);
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
      //00301106432@PARADA@HUGO LUIS ALBERTO@M@25334392@A@21/06/1976@24/09/2014@204
      var str = barcodeData.text;
      var datosScan = str.split("@", str.length);

      this.modelo = {
        'nombre': datosScan[2],
        'apellido': datosScan[1],
        'documento': datosScan[4],
        'fechaNacimiento': moment(datosScan[6], 'DD/MM/YYYY', true).format(),
        'sexo': datosScan[3] == 'M' ? 'masculino' : 'femenino',
        'genero': datosScan[3] == 'M' ? 'Masculino' : 'Femenino',
        'telefono': null // this.info.phoneNumber
      };
      this.storage.set("barscancode", this.modelo);
      this.navCtrl.push(RegistroUserDataPage, { user: this.modelo });

      // this.navCtrl.pop();
    }, (err) => {

    });
  }
}
