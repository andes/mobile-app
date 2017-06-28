import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Storage } from '@ionic/storage'
import { BienvenidaPage } from '../bienvenida/bienvenida';
import { AuthProvider } from '../../providers/auth/auth';
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

  esconderLogoutBtn: boolean = true;
  mostrarMenu: boolean = false;

  formIngresoCodigo: FormGroup;
  submit: boolean = false;
  email: any = '';

  constructor(public storage: Storage, public authService: AuthProvider, public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder) {

    this.formIngresoCodigo = formBuilder.group({
      // codigo: ['', Validators.compose([Validators.required, Validators.maxLength(6)])]
      email: ['', Validators.required],
      codigo: ['']
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerificaCodigoPage');
    this.storage.get('emailCodigo').then((val) => {
      if (val) {
        this.email = val;
        this.formIngresoCodigo.patchValue({ email: this.email });
      }
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {

    // this.storage.get('emailCodigo').then((val) => {
    // this.email = val;
    // let datos = {
    //   'email': this.email,
    //   'codigo': value
    // }

    this.authService.verificarCodigo(value).then((result) => {
      this.navCtrl.setRoot(BienvenidaPage);
    }, (err) => {

    });
    // });
  }

  reenviarCodigo() {
    this.storage.get('emailCodigo').then((val) => {
      this.email = val;
      this.authService.reenviarCodigo(this.email).then((result) => {

        // debugger; let data = result;
        // this.navCtrl.push(VerificarCodigoPage);
      }, (err) => {

      });
    });
  }
}
