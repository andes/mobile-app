import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage'
import { AlertController } from 'ionic-angular';

// pages
import { BienvenidaPage } from '../../bienvenida/bienvenida';

// providers
import { AuthProvider } from '../../../providers/auth/auth';
import { ToastProvider } from '../../../providers/toast';
import { DeviceProvider } from '../../../providers/auth/device';


import config from '../../../config';

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
  codigo: string;

  constructor(
    public toastProvider: ToastProvider,
    public alertCtrl: AlertController,
    public storage: Storage,
    public authService: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public deviceProvider: DeviceProvider) {

    this.formIngresoCodigo = formBuilder.group({
      // codigo: ['', Validators.compose([Validators.required, Validators.maxLength(6)])]
      email: ['', Validators.required],
      codigo: ['']
    });

  }

  stopReception() {
    if ((window as any).SmsReceiver) {
      (window as any).SmsReceiver.stopReception(() => true, () => true);
    }
  }

  ngOnDestroy() {
    // this.stopReception();
  }

  ionViewDidLoad() {
    this.storage.get('emailCodigo').then((val) => {
      if (val) {
        this.email = val;
        this.formIngresoCodigo.patchValue({ email: this.email });
      }
    });

    if ((window as any).SmsReceiver) {
      (window as any).SmsReceiver.startReception(({ messageBody, originatingAddress }) => {
        let datos = {
          email: this.email,
          codigo: messageBody
        }

        this.validaCodigo(datos);
      }, () => {
        alert("Error while receiving messages")
      });
    }
  }

  validaCodigo(datos) {
    this.authService.verificarCodigo(datos).then((result) => {
      this.deviceProvider.sync();
      this.navCtrl.setRoot(BienvenidaPage);
      this.stopReception();
    }, (err) => {
      this.toastProvider.danger('Código de verificación incorrecto.')
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.authService.verificarCodigo(value).then((result) => {
      this.deviceProvider.sync();
      this.navCtrl.setRoot(BienvenidaPage);
      this.stopReception();
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
