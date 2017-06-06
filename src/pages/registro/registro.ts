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

  // modelo: any = {};
  loading: any;

  formRegistro: FormGroup;

  submit: boolean = false;

  constructor(public authService: AuthProvider, public loadingCtrl: LoadingController, public navCtrl: NavController,
    public navParams: NavParams, public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    // this.modelo = {};

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

  ngOnInit() {
    // initialize model here
    // this.usuario = {
    //   nombre: '',
    //   appelido: '',
    //   email: '',
    //   telefono: 0,
    //   password: '',
    //   confirmPassword: ''
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

  onSubmit() {
    console.log(this.formRegistro);
  }

  // registrar(model: Usuario, isValid: boolean) {
  save() {
    // this.showLoader();

    this.submit = true;

    if (!this.formRegistro.valid) {
      alert("Formulario no es valido");
    }
    else {
      console.log("success!")
      console.log(this.formRegistro.value);
    }
    // this.authService.createAccount(model).then((result) => {
    //   this.loading.dismiss();
    //   this.showAlert(result);

    //   this.navCtrl.push(TurnosPage);
    // }, (err) => {
    //   this.loading.dismiss();
    // });

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
      title: 'Bienvenido A ANDES ' + nombreUsuario,
      subTitle: 'El registro se hizo correctamente',
      buttons: ['OK']
    });
    alert.present();
  }
}
