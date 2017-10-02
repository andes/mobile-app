import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { ToastProvider } from '../../../providers/toast';
import { FormBuilder, Validators } from '@angular/forms';
import { PacienteProvider } from '../../../providers/paciente';


@Component({
  selector: 'page-recuperar-password',
  templateUrl: 'recuperar-password.html',
})
export class RecuperarPasswordPage {
  public formRecuperar: any;
  public formResetear: any;
  public displayForm: boolean = false;
  public reset: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public toast: ToastProvider,
    public formBuilder: FormBuilder,
    public pacienteProvider: PacienteProvider) {

    let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

    this.formRecuperar = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])]
    });

    this.formResetear = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      codigo: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      password2: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecuperarPasswordPage');
  }

  sendCode() {
    if (this.formRecuperar) {
      const email = this.formRecuperar.value.email;

      this.authProvider.sendCode(email).then( result => {
        this.toast.success("Su codigo ha sido enviado, por favor revise su email");
      }).catch(error => {
        console.log(error);
        if (error) {
          this.toast.danger(error.error);
        }
      });
    }
  }

  resetPassword() {
    if (this.formResetear) {
      let data: any = {};

      let email = this.formResetear.value.email;
      let codigo = this.formResetear.value.codigo;
      let password = this.formResetear.value.password;
      let password2 = this.formResetear.value.password2;

      if ( password != password2) {
        this.toast.danger('LAS CONTRASEÑAS NO COINCIDEN');
        return;
      }

      this.authProvider.restorePassword(email, codigo, password, password2).then((data) => {
        this.toast.success('PASSWORD MODIFICADO CORRECTAMENTE');
        //this.navCtrl.setRoot(HomePage);
      }).catch((err) => {
        /*
        if (err.email) {
          this.toast.danger('EMAIL INCORRECTO');
        } else {
          this.toast.danger('CONTRASEÑA ACTUAL INCORRECTA');
        }
        */
        this.toast.danger(err.error);
      });
    }
  }

  cancel() {
    this.displayForm = false,
    this.reset = {};
  }
}
