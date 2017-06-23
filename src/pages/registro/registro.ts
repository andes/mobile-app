import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { TurnosPage } from '../turnos/turnos';
import { NavbarPage } from '../navbar/navbar';

import { Usuario } from '../../interfaces/usuario.interface';

import { PasswordValidation } from '../../validadores/validar-password';
// import { DatabaseProvider } from '../../providers/database/database';
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
  public usuario: Usuario;

  loading: any;
  esconderLogoutBtn : boolean = true;
  mostrarMenu: boolean = true;

  formRegistro: FormGroup;

  submit: boolean = false;

  constructor(public authService: AuthProvider, public loadingCtrl: LoadingController, public navCtrl: NavController,
    public navParams: NavParams, public alertCtrl: AlertController, public formBuilder: FormBuilder) {

    let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

    this.formRegistro = formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      telefono: ['', Validators.required],
      password: ['', Validators.required],
      confirmarPassword: ['', Validators.required]
    },
      {
        validator: PasswordValidation.MatchPassword
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

  onSubmit({ value, valid }: { value: Usuario, valid: boolean }) {
    debugger;
    
    this.showLoader();

    this.authService.createAccount(value).then((result) => {
      this.showAlert(result);
      this.loading.dismiss();
      this.navCtrl.push(TurnosPage);
    }, (err) => {
      this.loading.dismiss();
    });
  }  

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Registrando...'
    });

    this.loading.present();
  }

  showAlert(result: any) {
    debugger;
    let nombreUsuario = result.user.nombre.charAt(0).toUpperCase() + result.user.nombre.slice(1);
    let alert = this.alertCtrl.create({
      title: 'Sr. ' + nombreUsuario,
      subTitle: 'El registro se hizo correctamente. Un código de verificación fue enviado por mail',
      buttons: ['OK']
    });
    alert.present();
  }
}
