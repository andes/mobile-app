import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { DatabaseProvider } from '../../providers/database/database';
/**
 * Generated class for the RegistroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  modelo: any = {};
  usuarios: any[] = [];

  constructor(public databaseprovider: DatabaseProvider, private storage: Storage, public navCtrl: NavController, public navParams: NavParams) {
    this.modelo = {};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

  getUsuarios() {
    this.databaseprovider.getUsuarios()
      .then(usuarios => {
        this.usuarios = usuarios;
      })
      .catch(error => {
        console.error(error);
      });
  }

  registrar(modelo) {
    this.databaseprovider.registro(modelo)
      // .then(response => {
      //   this.usuarios.unshift(data);
      // })
      .catch(error => {
        console.error(error);
      })
    // this.storage.set('nombre', modelo.nombre);
    // this.storage.set('apellido', modelo.apellido);
  }

  ver() {
    this.storage.get('nombre').then((val) => {
      alert('El nombre es: ' + val);
    });
  }
}
