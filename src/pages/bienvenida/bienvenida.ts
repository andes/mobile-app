import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as moment from 'moment/moment';

import { DatePicker } from '@ionic-native/date-picker';
import { AuthProvider } from '../../providers/auth/auth';
import { RegistroUserDataPage } from '../registro/user-data/user-data';
import { TurnosPage } from '../turnos/turnos';
/**
 * Generated class for the EscanerDniPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-bienvenida',
  templateUrl: 'bienvenida.html',
})
export class BienvenidaPage implements OnInit {

  loading: any;
  mostrarMenu: boolean = true;
  modelo: any = {};
  info: any;
  user: any;

  ngOnInit() {
    //00301106432@PARADA@HUGO LUIS ALBERTO@M@25334392@21/06/1976@24/09/2014@204
    // var str = '00301106432@PARADA@HUGO LUIS ALBERTO@M@25334392@21/06/1976@24/09/2014@204';
    // var datosScan = str.split("@", str.length);

    // this.modelo = {
    //   'nombre': datosScan[2],
    //   'apellido': datosScan[1],
    //   'dni': datosScan[4],
    //   'fechaNacimiento': moment(datosScan[5], 'DD/MM/YYYY', true).format(),
    //   'sexo': 'F'
    // }
  }

  constructor(private datePicker: DatePicker, public loadingCtrl: LoadingController, public authService: AuthProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.user = this.authService.user;
  }

  ionViewDidLoad() {
    //
  }

  continuar() {
    this.navCtrl.setRoot(TurnosPage);
  }


}
