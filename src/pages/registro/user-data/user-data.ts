import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { PasswordValidation } from '../../../validadores/validar-password';
import { Storage } from '@ionic/storage'

// providders
import { ToastProvider } from '../../../providers/toast';
import { AuthProvider } from '../../../providers/auth/auth';

// pages
import { DeviceProvider } from '../../../providers/auth/device';
import { HomePage } from '../../home/home';


@Component({
    selector: 'page-registro-user-data',
    templateUrl: 'user-data.html',
})
export class RegistroUserDataPage {
    loading: any;
    formRegistro: FormGroup;
    submit = false;
    errors: any = {};
    telefono: string;

    email: string;
    password: string;
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
        this.password = this.navParams.get('old_password');

        this.formRegistro = formBuilder.group({
            password: ['', Validators.required],
            confirmarPassword: ['', Validators.required],
            //   terminos: [false, Validators.compose([Validators.required, Validators.pattern('true')])]
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
        this.authService.login({
            email: this.email,
            password: this.password,
            new_password: value.password
        }).then((result: any) => {
            this.running = false;
            this.loading.dismiss();
            this.deviceProvider.sync();
            this.navCtrl.setRoot(HomePage);
        }, (err) => {
            this.running = false;
            this.loading.dismiss();
            if (err) {
                this.toastCtrl.danger('HUBO PROBLEMAS EN LA CONEXIÓN');
            }
        });
    }

    showConditions() {
        // console.error('not implemented yet!!');
    }

    showLoader() {
        this.loading = this.loadingCtrl.create({
            content: 'Registrando...'
        });
        this.loading.present();
    }

}
