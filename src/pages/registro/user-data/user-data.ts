import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { PasswordValidation } from '../../../validadores/validar-password';
import { Storage } from '@ionic/storage'

// providders
import { ToastProvider } from '../../../providers/toast';
import { AuthProvider } from '../../../providers/auth/auth';

//pages
import { DeviceProvider } from '../../../providers/auth/device';
import { BienvenidaPage } from '../../bienvenida/bienvenida';


@Component({
  selector: 'page-registro-user-data',
  templateUrl: 'user-data.html',
})
export class RegistroUserDataPage {
  loading: any;
  mostrarMenu: boolean = false;
  formRegistro: FormGroup;
  submit: boolean = false;
  errors: any = {};
  telefono: string;

  email: string;
  code: string;
  dataMpi: any = {};
  running = false;

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

    // let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
    // let phoneRegex = /^[1-3][0-9]{9}$/;

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

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.showLoader();
    this.errors = {};
    this.running = true;
    this.authService.createAccount(this.email, this.code, this.dataMpi, value.password).then((result: any) => {
      this.running = false;
      this.loading.dismiss();
      this.deviceProvider.sync();
      this.navCtrl.setRoot(BienvenidaPage);
    }, (err) => {
      this.running = false;
      this.loading.dismiss();
      if (err) {
        this.toastCtrl.danger('HUBO PROBLEMAS EN LA CONEXIÖN');
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

}
