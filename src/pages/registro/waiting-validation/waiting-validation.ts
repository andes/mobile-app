import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { Usuario } from '../../../interfaces/usuario.interface';
import { PasswordValidation } from '../../../validadores/validar-password';
import { VerificaCodigoPage } from '../../verifica-codigo/verifica-codigo';
import { Storage } from '@ionic/storage'
// import { DatabaseProvider } from '../../providers/database/database';
/**
 * Generated class for the RegistroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-waiting-validation',
  templateUrl: 'waiting-validation.html',
})
export class WaitingValidationPage {
  usuario: any;

  constructor(public storage: Storage, public authService: AuthProvider, public loadingCtrl: LoadingController, public navCtrl: NavController,
    public navParams: NavParams, public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    this.usuario = this.navParams.get('user');
  }

  ionViewDidLoad() {
    //
  }

  onBack() {
    this.navCtrl.pop();
  }

}
