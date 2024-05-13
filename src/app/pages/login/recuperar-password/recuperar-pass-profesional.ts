import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
// Providers
import { AuthProvider } from '../../../../providers/auth/auth';
import { ToastProvider } from '../../../../providers/toast';

@Component({
    selector: 'app-recuperar-pass-profesional',
    templateUrl: 'recuperar-pass-profesional.html',
})
export class RecuperarPassProfesionalPage implements OnInit {
    public formRecuperar: any;
    public formResetear: any;
    public displayForm = false;
    public reset: any = {};
    public loading = false;
    @ViewChild(IonContent) content: IonContent;

    constructor(
        private authProvider: AuthProvider,
        private toast: ToastProvider,
        private formBuilder: FormBuilder,
        private router: Router) {
    }

    ngOnInit(): void {
        const emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+[\.]{1}[a-z]{2,4}$';
        this.formRecuperar = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])]
        });
        this.formResetear = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
            codigo: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])],
            password2: ['', Validators.compose([Validators.required])]
        });
    }

    public sendCode() {
        const email = this.formRecuperar.value.email;
        this.loading = true;
        this.authProvider.resetPassword(email).then(result => {
            this.loading = false;
            this.content.scrollToTop();
            this.toast.success('El código fue enviado a ' + email);
            this.displayForm = true;
            this.formResetear.patchValue({ email });
        }).catch(error => {
            this.loading = false;
            if (error) {
                this.toast.danger(error.error);
            }
        });
    }

    public yaTengo() {
        this.displayForm = true;
        this.content.scrollToTop();
    }

    public resetPassword() {
        const email = this.formResetear.value.email;
        const codigo = this.formResetear.value.codigo;
        const password = this.formResetear.value.password;
        const password2 = this.formResetear.value.password2;
        if (password !== password2) {
            this.toast.danger('Las contraseñas no coinciden.');
            return;
        }
        this.loading = true;
        this.authProvider.restorePassword(email, codigo, password, password2).then((data) => {
            this.loading = false;
            this.toast.success('Contraseña modificada correctamente.');
            this.router.navigate(['home']);
        }).catch((err) => {
            this.loading = false;
            if (err) {
                this.toast.danger(err.error);
            }
        });
    }

    public cancel() {
        this.displayForm = false,
            this.reset = {};
    }

    public volverALogin() {
        this.router.navigateByUrl('/login');
    }

    public onKeyPress($event, tag) {
        if ($event.keyCode === 13 && !this.loading) {
            if (tag === 'submit-1') {
                if (this.formRecuperar && this.formRecuperar.valid) {
                    this.sendCode();
                } else {
                    this.toast.danger('Revise los datos ingresados');
                }
            } else if (tag === 'submit-2') {
                if (this.formResetear && this.formResetear.valid) {
                    this.resetPassword();
                } else {
                    this.toast.danger('Revise los datos ingresados');
                }
            } else {
                const element = document.getElementById(tag);
                if (element) {
                    element.focus();
                }
            }
        }
    }

    get emailCodigo() {
        if (this.formRecuperar.valid) {
            return ` a ${this.formRecuperar.value.email}`;
        }
    }
}