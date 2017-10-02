import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Usuario } from '../../../interfaces/usuario.interface';
import { PasswordValidation } from '../../../validadores/validar-password';
import { Storage } from '@ionic/storage'

// providders
import { ToastProvider } from '../../../providers/toast';
import { AuthProvider } from '../../../providers/auth/auth';

//pages
import { WaitingValidationPage } from '../waiting-validation/waiting-validation';
import { VerificaCodigoPage } from '../../registro/verifica-codigo/verifica-codigo';
import { DeviceProvider } from '../../../providers/auth/device';
import { BienvenidaPage } from '../../bienvenida/bienvenida';


@Component({
  selector: 'page-registro-user-data',
  templateUrl: 'user-data.html',
})
export class RegistroUserDataPage {
  public usuario: Usuario;
  loading: any;
  mostrarMenu: boolean = false;
  formRegistro: FormGroup;
  submit: boolean = false;
  errors: any = {};
  telefono: string;

  email: string;
  code: string;
  dataMpi: any = {};

  constructor(
    private toastCtrl: ToastProvider,
    public storage: Storage,
    public authService: AuthProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public deviceProvider: DeviceProvider) {

    this.email = this.navParams.get('email');
    this.code = this.navParams.get('code');
    // this.dataMpi = this.navParams.get('dataMpi');

    let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
    let phoneRegex = /^[1-3][0-9]{9}$/;

    this.formRegistro = formBuilder.group({
      // telefono: ['', Validators.compose([Validators.required, Validators.pattern(phoneRegex)])],
      // email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', Validators.required],
      confirmarPassword: ['', Validators.required],
      terminos: [false, Validators.compose([Validators.required, Validators.pattern('true')])]
    }, {
        validator: PasswordValidation.MatchPassword
      }
    );
  }

  ionViewDidLoad() {
    //
  }

  onSubmit({ value, valid }: { value: Usuario, valid: boolean }) {
    this.showLoader();
    this.errors = {};
    // var data: any = {
    //   ...this.usuario,
    //   ...value
    // };

    this.authService.createAccount(this.email, this.code, this.dataMpi, value.password).then((result: any) => {
      this.loading.dismiss();
      this.deviceProvider.sync();
      this.navCtrl.setRoot(BienvenidaPage);

      // this.storage.set('emailCodigo', data.email);
      // this.storage.set('dni', data.documento);
      // let toView: any = null;
      // if (result.valid) {
      //   toView = VerificaCodigoPage;
      // } else {
      //   toView = WaitingValidationPage;
      // }

      // this.navCtrl.push(toView, { user: data }).then(() => {
      //   const index = this.navCtrl.getActive().index;
      //   this.navCtrl.remove(index - 1);
      //   this.navCtrl.remove(index - 2);
      //   this.navCtrl.remove(index - 3);
      // });

    }, (err) => {
      this.loading.dismiss();
      this.toastCtrl.danger('ALGO SALIO MAL');

      // let text = 'El e-mail ya se encuentra registrado.';
      // this.errors.email = 'El e-mail ya se encuentra registrado.';
      // let control = this.formRegistro.controls['email'].setErrors({ message: text });
      // this.toastCtrl.danger(text);
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

}
