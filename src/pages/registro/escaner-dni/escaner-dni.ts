import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment/moment';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DatePicker } from '@ionic-native/date-picker';

import { DocumentoEscaneado, DocumentoEscaneados } from '../regex-documento-scan';

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

  public textoLibre: string = null;

  ngOnInit() {
    //00301106432@PARADA@HUGO LUIS ALBERTO@M@25334392@A@21/06/1976@24/09/2014@204
    this.textoLibre = '00301106432@PARADA@HUGO LUIS ALBERTO@M@25334392@A@21/06/1976@24/09/2014@204';

    let pepe = this.comprobarDocumentoEscaneado(this.textoLibre);
    debugger;
    this.parseDocumentoEscaneado(pepe);

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

  private comprobarDocumentoEscaneado(documento): any {

    for (let key in DocumentoEscaneados) {

      if (DocumentoEscaneados[key].regEx.test(documento)) {

        return DocumentoEscaneados[key];
      }
    }

    return null;
  }

  private parseDocumentoEscaneado(documento: any): any {
    debugger;
    let datos = this.textoLibre.match(documento.regEx);
    let sexo = "";
    if (documento.grupoSexo > 0) {
      sexo = (datos[documento.grupoSexo].toUpperCase() === 'F') ? 'Femenino' : 'Masculino';
    }

    let fechaNacimiento = null;
    if (documento.grupoFechaNacimiento > 0) {
      fechaNacimiento = moment(datos[documento.grupoFechaNacimiento], 'DD/MM/YYYY', true).format()//moment(datos[documento.grupoFechaNacimiento], 'DD/MM/YYYY')
    }

    this.modelo = {
      'nombre': datos[documento.grupoNombre],
      'apellido': datos[documento.grupoApellido],
      'documento': datos[documento.grupoNumeroDocumento].replace(/\D/g, ''),
      'fechaNacimiento': fechaNacimiento,//   fechaNacimiento: fechaNacimiento
      'sexo': sexo,
      'genero': sexo,
      'telefono': null
    };
    debugger;
    this.storage.set("barscancode", this.modelo);
    this.navCtrl.push(RegistroPersonalDataPage, { user: this.modelo });

    // return {
    //   documento: datos[documento.grupoNumeroDocumento].replace(/\D/g, ''),
    //   apellido: datos[documento.grupoApellido],
    //   nombre: datos[documento.grupoNombre],
    //   sexo: sexo,
    //   fechaNacimiento: fechaNacimiento
    // };
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
      this.textoLibre = barcodeData.text;

      let pepe = this.comprobarDocumentoEscaneado(this.textoLibre);
      debugger;
      this.parseDocumentoEscaneado(pepe);
      //00301106432@PARADA@HUGO LUIS ALBERTO@M@25334392@A@21/06/1976@24/09/2014@204
      // let str = barcodeData.text;

      // this.comprobarDocumentoEscaneado(str);

      // var datosScan = str.split("@", str.length);

      // this.modelo = {
      //   'nombre': datosScan[2],
      //   'apellido': datosScan[1],
      //   'documento': datosScan[4],
      //   'fechaNacimiento': datosScan[6], //moment(datosScan[6], 'DD/MM/YYYY', true).format(),
      //   'sexo': datosScan[3] == 'M' ? 'Masculino' : 'Femenino',
      //   'genero': datosScan[3] == 'M' ? 'Masculino' : 'Femenino',
      //   'telefono': null
      // };
      // this.storage.set("barscancode", this.modelo);
      // this.navCtrl.push(RegistroPersonalDataPage, { user: this.modelo });
    }, (err) => {

    });
  }
}
