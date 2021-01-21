import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ToastProvider } from 'src/providers/toast';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-page-profile-account',
    templateUrl: 'profile-account.html',
})
export class ProfileAccountPage implements OnInit {
    loading: any;
    fase = 1;
    formRegistro: FormGroup;
    submit = false;
    expand = false;

    email: string;
    telefono: string;
    password = '';
    password2 = '';
    oldPassword = '';

    emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    phoneRegex = /^[1-3][0-9]{9}$/;

    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public router: Router,
        public toast: ToastProvider) {
    }

    ngOnInit() {
        this.email = this.authService.user.email;
        this.telefono = this.authService.user.telefono;
    }

    onSave() {
        const data: any = {};
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

        if (this.expand && (!this.password.length && !this.oldPassword.length && !this.password2.length)) {
            this.toast.danger('DEBERÁ COMPLETAR TODOS LOS CAMPOS PARA CAMBIAR SU CONTRASEÑA');
            return;
        }

        if (this.password.length + this.oldPassword.length + this.password2.length > 0) {
            if (this.oldPassword.length === 0) {
                this.toast.danger('INGRESE CORRECTAMENTE SU CONTRASEÑA ACTUAL');
                return;
            }

            if (this.password.length === 0 || this.password !== this.password2) {
                this.toast.danger('INGRESE CORRECTAMENTE LA CONTRASEÑA NUEVA');
                return;
            }

            data.password = this.password;
            data.old_password = this.oldPassword;
        }
        this.loading = true;
        this.authService.update(data).then((updatedData) => {
            this.loading = false;
            this.toast.success('DATOS MODIFICADOS CORRECTAMENTE');
            this.router.navigate(['/home']);
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