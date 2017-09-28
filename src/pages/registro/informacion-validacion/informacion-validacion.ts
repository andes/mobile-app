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
@Component({
  selector: 'page-informacion-validacion',
  templateUrl: 'informacion-validacion.html',
})
export class InformacionValidacionPage implements OnInit {

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
    public navParams: NavParams) {

  }

  ionViewDidLoad() {

  }

  openMap(direccion) {
    window.open('geo:?q=' + direccion);
  }

}
