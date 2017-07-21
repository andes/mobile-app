import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { BienvenidaPage } from '../bienvenida/bienvenida';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastProvider } from '../../providers/toast';

/**
 * Generated class for the VerificaCodigoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-verifica-codigo',
  templateUrl: 'verifica-codigo.html',
})
export class VerificaCodigoPage {
  mostrarMenu: boolean = false;
  formIngresoCodigo: FormGroup;
  submit: boolean = false;
  email: any = '';

  constructor(
    public toastProvider: ToastProvider,
    public alertCtrl: AlertController,
    public storage: Storage,
    public authService: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder) {

    this.formIngresoCodigo = formBuilder.group({
      // codigo: ['', Validators.compose([Validators.required, Validators.maxLength(6)])]
      email: ['', Validators.required],
      codigo: ['']
    });

  }

  ionViewDidLoad() {
    this.storage.get('emailCodigo').then((val) => {
      if (val) {
        this.email = val;
        this.formIngresoCodigo.patchValue({ email: this.email });
      }
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {

    this.authService.verificarCodigo(value).then((result) => {
      this.navCtrl.setRoot(BienvenidaPage);
    }, (err) => {
      this.toastProvider.danger('Código de verificación invalido.')
    });

  }

  reenviarCodigo() {
    this.email = this.formIngresoCodigo.value.email;
    this.authService.reenviarCodigo(this.email).then((result) => {
      this.showAlert('', 'Hemos reenviado un código de verificación a su email/celular.');
    }, (err) => {
      this.showAlert('', 'Su identidad esta pendiente de verificación. Tienes que acercarse a una ventanilla para validarla.');
    });
  }

  showAlert(title: string, text: string) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
