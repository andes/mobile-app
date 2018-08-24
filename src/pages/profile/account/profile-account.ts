import { HomePage } from './../../home/home';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { ToastProvider } from '../../../providers/toast';

@Component({
    selector: 'page-profile-account',
    templateUrl: 'profile-account.html',
})
export class ProfileAccountPage {
    loading: any;
    fase = 1;
    formRegistro: FormGroup;
    submit = false;
    expand: Boolean = false;

    email: String;
    telefono: String;
    password = '';
    password2 = '';
    old_password = '';

    emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    phoneRegex = /^[1-3][0-9]{9}$/;

    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public menu: MenuController,
        public toast: ToastProvider) {

        this.email = this.authService.user.email;
        this.telefono = this.authService.user.telefono;

    }


    ionViewDidLoad() {
    }

    ionViewDidEnter() {

    }

    onSave() {
        let data: any = {};
        if (this.telefono !== this.authService.user.telefono) {
            if (!this.phoneRegex.test(this.telefono as string)) {
                this.toast.danger('INGRESE UN CELULAR CORRECTO');
                return;
            }
            data.telefono = this.telefono;
        }


        if (this.email !== this.authService.user.email) {
            if (this.emailRegex.test(this.email as string)) {
                data.email = this.email;
            } else {
                this.toast.danger('INGRESE UN EMAIL CORRECTO');
                return;
            }
        }

        if (this.expand && (!this.password.length && !this.old_password.length && !this.password2.length)) {
            this.toast.danger('DEBERÁ COMPLETAR TODOS LOS CAMPOS PARA CAMBIAR SU CONTRASEÑA');
            return;
        }

        if (this.password.length + this.old_password.length + this.password2.length > 0) {
            if (this.old_password.length === 0) {
                this.toast.danger('INGRESE CORRECTAMENTE SU CONTRASEÑA ACTUAL');
                return;
            }

            if (this.password.length === 0 || this.password !== this.password2) {
                this.toast.danger('INGRESE CORRECTAMENTE LA CONTRASEÑA NUEVA');
                return;
            }

            data.password = this.password;
            data.old_password = this.old_password;
        }
        this.loading = true;
        this.authService.update(data).then((_data) => {
            this.loading = false;
            this.toast.success('DATOS MODIFICADOS CORRECTAMENTE');
            this.navCtrl.setRoot(HomePage);
        }).catch((err) => {
            this.loading = false;
            if (err.email) {
                this.toast.danger('EMAIL INCORRECTO');
            } else {
                this.toast.danger('CONTRASEÑA ACTUAL INCORRECTA');
            }
        });
    }
}
