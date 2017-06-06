import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { NavbarPage } from '../navbar/navbar';

/**
 * Generated class for the UsuariosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-usuarios',
  templateUrl: 'usuarios.html',
})
export class UsuariosPage {

usuarios: any;

  constructor(public authService: AuthProvider, public usuarioService: UsuariosProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsuariosPage');

    this.usuarioService.getUsuarios().then((data) => {
      this.usuarios = data;
    }, (err) => {
      console.log("Usuarios No está autorizado");
    });
  }

}
