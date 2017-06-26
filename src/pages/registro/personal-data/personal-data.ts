import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { AuthProvider } from '../../../providers/auth/auth';
import { TurnosPage } from '../../turnos/turnos';
import { NavbarPage } from '../../navbar/navbar';

import { Usuario } from '../../../interfaces/usuario.interface';

import { PasswordValidation } from '../../../validadores/validar-password';
import { RegistroUserDataPage } from '../user-data/user-data';
// import { DatabaseProvider } from '../../providers/database/database';
/**
 * Generated class for the RegistroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-registro-personal-data',
  templateUrl: 'personal-data.html',
})
export class RegistroPersonalDataPage {
  public usuario: Usuario;
  loading: any;
  esconderLogoutBtn: boolean = true;
  mostrarMenu: boolean = true;
  fase: number = 1;
  formRegistro: FormGroup;

  submit: boolean = false;

  constructor(public authService: AuthProvider, public loadingCtrl: LoadingController, public navCtrl: NavController,
    public navParams: NavParams, public alertCtrl: AlertController, public formBuilder: FormBuilder) {

    this.formRegistro = formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      documento: ['', Validators.required],
      sexo: ['', Validators.required],
      genero: ['', Validators.required],
      nacionalidad: ['', Validators.required],
    });

    this.formRegistro.patchValue({
      sexo: 'femenino',
      nacionalidad: 'Argentina'
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

  onSubmit({ value, valid }: { value: Usuario, valid: boolean }) {
    this.navCtrl.push(RegistroUserDataPage, { user: value });
  }
}
