import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastProvider } from 'src/providers/toast';
import { PacienteProvider } from 'src/providers/paciente';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-informacion-validacion',
    templateUrl: 'informacion-validacion.html',
})
export class InformacionValidacionPage implements OnInit {

    loading: any;
    modelo: any = {};
    info: any;
    paciente: any = {};
    public textoLibre: string = null;
    public formRegistro: any;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private toast: ToastProvider,
        public toastController: ToastController,
        private pacienteProvider: PacienteProvider) {
    }

    ngOnInit(): void {
        const emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
        const patronDocumento = '^[1-9]{1}[0-9]{4,7}$';
        const patronContactoNumerico = '^[1-9]{3}[0-9]{6,7}$';
        this.formRegistro = this.formBuilder.group({
            documento: ['', Validators.compose([Validators.required, Validators.pattern(patronDocumento)])],
            celular: ['', Validators.compose([Validators.required, Validators.pattern(patronContactoNumerico)])],
            email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
            tramite: ['', Validators.compose([Validators.required])],
            sexo: ['', Validators.compose([Validators.required])],
            recaptcha: ['', Validators.compose([Validators.required])]
        });
    }

    trimEmail(value) {
        this.formRegistro.patchValue({
            email: value.replace(/\s/g, '').toLowerCase()
        });
    }

    public cancel() {
        this.router.navigate(['/home']);
    }

    registrarUsuario() {
        this.paciente.documento = this.formRegistro.controls.documento.value;
        this.paciente.sexo = this.formRegistro.controls.sexo.value;
        this.paciente.tramite = this.formRegistro.controls.tramite.value;
        this.paciente.telefono = this.formRegistro.controls.celular.value;
        this.paciente.email = this.formRegistro.controls.email.value;
        this.paciente.recaptcha = this.formRegistro.controls.recaptcha.value;
        this.pacienteProvider.registro(this.paciente).then(async (resultado: any) => {
            if (resultado._id) {
                const toast = await this.toastController.create({
                    message: 'Su cuenta ha sido creada con éxito. Por favor, revise su casilla de correo electrónico.',
                    duration: 5000,
                    color: 'success'
                });
                await toast.present();
                this.router.navigate(['home']);
            }
        }).catch(async (err) => {
            const toast = await this.toastController.create({
                message: err.error._body,
                duration: 5000,
                color: 'danger'
            });
            await toast.present();
        });
        this.cleanCaptcha();
    }

    addContacto(key, value) {
        const index = this.paciente.contacto.findIndex(item => item.tipo === key);
        if (index >= 0) {
            return this.paciente.contacto[index].valor = value;
        } else {
            const nuevo = {
                tipo: key,
                valor: value,
                ranking: 1,
                activo: true,
                ultimaActualizacion: new Date()
            };
            this.paciente.contacto.push(nuevo);
        }
    }

    cleanCaptcha() {
        this.formRegistro.controls.recaptcha.reset();
    }

    get celular() {
        return this.formRegistro.get('celular');
    }



}
