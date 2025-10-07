import { Component, ViewChild, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { IonContent } from "@ionic/angular";
import { Router } from "@angular/router";
// Providers
import { AuthProvider } from "../../../../providers/auth/auth";
import { ToastProvider } from "../../../../providers/toast";

@Component({
    selector: "app-validar-codigo-profesional",
    templateUrl: "validar-codigo-profesional.html",
})
export class ValidarCodigoProfesionalPage implements OnInit {
    public formValidarOTP: any;
    public reset: any = {};
    public loading = false;
    @ViewChild(IonContent) content: IonContent;

    constructor(
        private authProvider: AuthProvider,
        private toast: ToastProvider,
        private formBuilder: FormBuilder,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.formValidarOTP = this.formBuilder.group({
            otpCode: ["", Validators.compose([Validators.required])],
            username: ["", Validators.compose([Validators.required])],
            password: ["", Validators.compose([Validators.required])],
            verificacionPassword: [
                "",
                Validators.compose([Validators.required]),
            ],
        });
    }

    public reenviarCodigo() {
        const username = this.formValidarOTP.controls["username"].value;
        this.loading = true;
        this.authProvider
            .sendOTPAndNotify(username.toString())
            .then((result) => {
                this.loading = false;
                this.content.scrollToTop();
                if (result.status === "ok") {
                    this.toast.success(
                        "Código enviado. Revise su bandeja de entrada"
                    );
                } else {
                    this.toast.danger(
                        "Ha habido un error. Inténtelo nuevamente."
                    );
                }
            })
            .catch((error) => {
                this.loading = false;
                if (error) {
                    this.toast.danger(
                        "No es posible realizar esta acción en este momento. Por favor intente más tarde."
                    );
                }
            });
    }

    public resetearPassword() {
        const username = this.formValidarOTP.value.username;
        const otpCode = this.formValidarOTP.value.otpCode;
        const password = this.formValidarOTP.value.password;
        const verificacionPassword =
            this.formValidarOTP.value.verificacionPassword;
        this.authProvider
            .validateOTPCodeAndResetPassword(username, otpCode, password)
            .then((result) => {
                this.loading = false;
                this.content.scrollToTop();
                if (result.status === "ok") {
                    this.toast.success(
                        "Su contraseña ha sido actualizada correctamente."
                    );
                    this.router.navigate(["login/profesional"]);
                } else {
                    this.toast.danger(
                        "Ha ocurrido un error. Revise los datos o pruebe reenviar un nuevo código a su correo."
                    );
                }
            })
            .catch((error) => {
                this.loading = false;
                if (error) {
                    this.toast.danger(
                        "No es posible realizar esta acción en este momento. Por favor intente más tarde."
                    );
                }
            });
        if (password !== verificacionPassword) {
            this.toast.danger("Las contraseñas no coinciden.");
            return;
        }
        return;
    }

    public cancel() {
        this.router.navigate(["login/profesional"]);
    }

    public volver() {
        this.router.navigate(["login/profesional"]);
    }

    public onKeyPress($event, tag) {
        if ($event.keyCode === 13 && !this.loading) {
            if (tag === "submit-1") {
                console.log(this.formValidarOTP);
                if (this.formValidarOTP && this.formValidarOTP.valid) {
                    this.resetearPassword();
                } else {
                    this.toast.danger("Revise los datos ingresados.");
                }
            } else {
                const element = document.getElementById(tag);
                if (element) {
                    element.focus();
                }
            }
        }
    }
}
