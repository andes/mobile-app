import { Component, ViewChild, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { IonContent } from "@ionic/angular";
import { Router } from "@angular/router";
// Providers
import { AuthProvider } from "../../../../../providers/auth/auth";
import { ToastProvider } from "../../../../../providers/toast";

@Component({
    selector: "app-recuperar-password-profesional",
    templateUrl: "recuperar-password-profesional.html",
})
export class RecuperarPasswordProfesionalPage implements OnInit {
    public formReestablecer: any;
    public reset: any = {};
    public loading = false;
    public redirectOneLogin = false;
    @ViewChild(IonContent) content: IonContent;

    constructor(
        private authProvider: AuthProvider,
        private toast: ToastProvider,
        private formBuilder: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        const dniRegex = /^[0-9]{7,8}$/;
        this.formReestablecer = this.formBuilder.group({
            username: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.pattern(dniRegex),
                ]),
            ],
        });
    }

    public resetearPassword() {
        const username = this.formReestablecer.value.username;
        this.loading = true;
        this.authProvider
            .sendOTPAndNotify(username)
            .then((result) => {
                this.loading = false;
                this.content.scrollToTop();
                if (result.status === "ok") {
                    this.toast.success(
                        "Código enviado. Revise su bandeja de entrada"
                    );
                    this.validarCodigo();
                } else {
                    if (result.status === "redirectOneLogin") {
                        this.redirectOneLogin = true;
                    } else {
                        this.toast.danger(
                            "Ha habido un error. Inténtelo nuevamente."
                        );
                    }
                }
            })
            .catch((error) => {
                this.loading = false;
                if (error) {
                    this.toast.danger(error.error);
                }
            });
    }

    public cancel() {
        this.router.navigate(["login/profesional"]);
    }

    public validarCodigo() {
        this.router.navigate(["login/validar-codigo-profesional"]);
    }

    public onKeyPress($event, tag) {
        if ($event.keyCode === 13 && !this.loading) {
            if (tag === "submit-1") {
                if (this.formReestablecer && this.formReestablecer.valid) {
                    this.resetearPassword();
                } else {
                    this.toast.danger("Revise los datos ingresados");
                }
            } else {
                const element = document.getElementById(tag);
                if (element) {
                    element.focus();
                }
            }
        }
    }

    public clearRedirectOneLoginMessage(){
        this.redirectOneLogin = false;
    }

    get emailCodigo() {
        if (this.formReestablecer.valid) {
            return ` a ${this.formReestablecer.value.username}`;
        }
    }
}
