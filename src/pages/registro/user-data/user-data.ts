import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { TurnosPage } from '../../turnos/turnos';
import { NavbarPage } from '../../navbar/navbar';
import { Usuario } from '../../../interfaces/usuario.interface';
import { PasswordValidation } from '../../../validadores/validar-password';
// import { DatabaseProvider } from '../../providers/database/database';
/**
 * Generated class for the RegistroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-registro-user-data',
  templateUrl: 'user-data.html',
})
export class RegistroUserDataPage {
  public usuario: Usuario;
  loading: any;
  esconderLogoutBtn: boolean = true;
  mostrarMenu: boolean = false;
  formRegistro: FormGroup;
  submit: boolean = false;
  errors: any = {};

  constructor(public authService: AuthProvider, public loadingCtrl: LoadingController, public navCtrl: NavController,
    public navParams: NavParams, public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    this.usuario = this.navParams.get('user');

    let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

    this.formRegistro = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', Validators.required],
      confirmarPassword: ['', Validators.required],
      terminos: [false, Validators.compose([Validators.required, Validators.pattern('true')])]
    }, {
        validator: PasswordValidation.MatchPassword
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

  onSubmit({ value, valid }: { value: Usuario, valid: boolean }) {
    this.showLoader();
    this.errors = {};
    var data = {
      ...this.usuario,
      ...value
    };

    this.authService.createAccount(data).then((result) => {
      this.showAlert(data);
      this.loading.dismiss();
      this.navCtrl.push(TurnosPage);
    }, (err) => {
      this.loading.dismiss();
      if (err.error.email) {
        this.errors.email = err.error.email;
      }
    });
  }

  showConditions() {
    console.error('not implemented yet!!');
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Registrando...'
    });
    this.loading.present();
  }

  showAlert(result: any) {
    let nombreUsuario = result.nombre.charAt(0).toUpperCase() + result.nombre.slice(1) + ' ' + result.apellido;
    let alert = this.alertCtrl.create({
      title: nombreUsuario,
      subTitle: 'El registro se hizo correctamente. Un código de verificación fue enviado por mail',
      buttons: ['OK']
    });
    alert.present();
  }
}
