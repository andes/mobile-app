import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment/moment';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DatePicker } from '@ionic-native/date-picker';

// providers
import { AuthProvider } from '../../../providers/auth/auth';

// pages
import { RegistroPersonalDataPage } from '../personal-data/personal-data';
import { RegistroUserDataPage } from '../user-data/user-data';
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

  constructor(
    public storage: Storage,
    public authService: AuthProvider,
    private barcodeScanner: BarcodeScanner,
    public navCtrl: NavController,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {

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
        'fechaNacimiento': datosScan[6], //moment(datosScan[6], 'DD/MM/YYYY', true).format(),
        'sexo': datosScan[3] == 'M' ? 'Masculino' : 'Femenino',
        'genero': datosScan[3] == 'M' ? 'Masculino' : 'Femenino',
        'telefono': null
      };
      this.storage.set("barscancode", this.modelo);
      this.navCtrl.push(RegistroPersonalDataPage, { user: this.modelo });
    }, (err) => {

    });
  }
}
