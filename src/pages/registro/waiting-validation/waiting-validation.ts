import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage'

// providers
import { AuthProvider } from '../../../providers/auth/auth';

// pages
import { VerificaCodigoPage } from '../../verifica-codigo/verifica-codigo';

@IonicPage()
@Component({
  selector: 'page-waiting-validation',
  templateUrl: 'waiting-validation.html',
})
export class WaitingValidationPage {
  usuario: any;
  formRegistro: FormGroup;
  expand: Boolean = false;

  constructor(
    public storage: Storage,
    public authService: AuthProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder) {

    this.usuario = this.navParams.get('user');
    this.formRegistro = formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
    });
    // this.usuario.sexo = this.usuario.sexo.toLowerCase();

    this.formRegistro.patchValue(this.usuario);

  }

  ionViewDidLoad() {
    //
  }

  onBack() {
    this.navCtrl.pop();
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      value.email = this.usuario.email;
      this.authService.updateAccount(value).then((data: any) => {
        if (data.valid) {
          this.navCtrl.setRoot(VerificaCodigoPage);
        } else {
          this.expand = false;
        }
        console.log(data);
      }).catch(() => {
        console.log('error');
      })
      // this.navCtrl.push(RegistroUserDataPage, { user: value });
    }
  }

  onKeyPress($event, tag) {
    if ($event.keyCode == 13) {
      let element = document.getElementById(tag);
      if (element) {
        if (element.getElementsByTagName('input').length > 0) {
          element.getElementsByTagName('input')[0].focus();
        } else if (element.getElementsByTagName('button').length > 0) {
          element.getElementsByTagName('button')[0].focus();
        }
      }
    }
  }

}
