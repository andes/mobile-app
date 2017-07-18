import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { LoginPage } from '../login/login';
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
  loading: any;
  mostrarMenu: boolean = true;
  esconderLogoutBtn: boolean = false;

  constructor(public authService: AuthProvider, public usuarioService: UsuariosProvider, public navCtrl: NavController,
    public navParams: NavParams, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsuariosPage');   
    // this.showLoader();

    // Check if already authenticated
    // this.authService.checkAuthentication().then((res) => {
    //   console.log("Ya está autorizado");
    //   this.loading.dismiss();

    //   this.usuarioService.getUsuarios().then((data) => {
    //     this.usuarios = data;
    //   }, (err) => {
    //     console.log("Usuarios No está autorizado");
    //   });
    // }, (err) => {
    //   console.log("No está autorizado");
    //   this.loading.dismiss();
    //   this.navCtrl.push(LoginPage);
    // });

    this.usuarioService.getUsuarios().then((data) => {
      this.usuarios = data;
    }, (err) => {
      console.log("Usuarios No está autorizado");
    });
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Verificando...'
    });

    this.loading.present();
  }

}
