import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

// providers
import { AuthProvider } from '../../../../providers/auth/auth';

// pages
// import { VerificaCodigoPage } from '../verifica-codigo/verifica-codigo';

@Component({
  selector: 'app-informacion-validacion',
  templateUrl: 'informacion-validacion.html',
})
export class InformacionValidacionPage implements OnInit {

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
    public navParams: NavParams) {

  }

  ionViewDidLoad() {

  }

  openMap(direccion) {
    window.open('geo:?q=' + direccion);
  }

  codigo() {
    // this.navCtrl.push(VerificaCodigoPage);
  }

}
