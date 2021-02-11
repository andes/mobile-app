import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastProvider } from 'src/providers/toast';
import { AuthProvider } from 'src/providers/auth/auth';

@Component({
    selector: 'app-informacion-validacion',
    templateUrl: 'informacion-validacion.html',
})
export class InformacionValidacionPage implements OnInit {

    loading: any;
    modelo: any = {};
    info: any;
    public textoLibre: string = null;
    public formRegistro: any;
    public attachment: any = [];
    private fileTypes = ['jpg', 'jpeg', 'png'];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private toast: ToastProvider,
        private authService: AuthProvider,
        private cd: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        const emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
        this.formRegistro = this.formBuilder.group({
            documento: ['', Validators.compose([Validators.required])],
            nombre: ['', Validators.compose([Validators.required])],
            apellido: ['', Validators.compose([Validators.required])],
            fechaNacimiento: ['', Validators.compose([Validators.required])],
            celular: ['', Validators.compose([Validators.required])],
            domicilio: ['', Validators.compose([Validators.required])],
            localidad: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
            centroSalud: ['', Validators.compose([Validators.required])],
            imagenFrontal: ['', Validators.compose([Validators.required])],
            imagenTrasera: ['', Validators.compose([Validators.required])]
        });
    }

    openMap(direccion) {
        window.open('geo:?q=' + direccion);
    }

    public cancel() {
        this.router.navigate(['/home']);
    }

    registrarUsuario() {
        const to = 'info@andes.gob.ar';
        const subject = `Nueva solicitud de alta de ${this.formRegistro.controls.apellido.value}, ${this.formRegistro.controls.nombre.value}`;
        const message = `<i>Documento:</i> ${this.formRegistro.controls.documento.value} <br>
        <i>Nombre:</i> ${this.formRegistro.controls.nombre.value} <br>
        <i>Apellido:</i> ${this.formRegistro.controls.apellido.value} <br>
        <i>Fecha de Nacimiento:</i> ${this.formRegistro.controls.fechaNacimiento.value} <br>
        <i>Celular:</i> ${this.formRegistro.controls.celular.value} <br>
        <i>Domicilio:</i> ${this.formRegistro.controls.domicilio.value} <br>
        <i>Localidad:</i> ${this.formRegistro.controls.localidad.value} <br>
        <i>Email:</i> ${this.formRegistro.controls.email.value} <br>
        <i>Centro de salud más cercano:</i> ${this.formRegistro.controls.centroSalud.value}`;
        this.attachment.push(this.formRegistro.controls.imagenFrontal.value);
        this.attachment.push(this.formRegistro.controls.imagenTrasera.value);
        this.loading = true;
        this.authService.enviarCorreo(to, subject, message, this.attachment).then(result => {
            this.toast.success('EL CORREO FUE ENVIADO');
            this.loading = false;
            this.router.navigate(['/home'], {
                replaceUrl: true
            });
        }).catch(error => {
            this.loading = false;
            if (error) {
                this.toast.danger('EL CORREO NO PUDO SER ENVIADO');
            }
        });
    }

    cargarImagenFrontal(event) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            const extension = file.name.split('.').pop().toLowerCase();
            const isSuccess = this.fileTypes.indexOf(extension) > -1;
            if (isSuccess) {
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.formRegistro.patchValue({
                        imagenFrontal: { filename: `frente-dni.${extension}`, content: reader.result }
                    });
                    this.cd.markForCheck();
                };
            } else {
                this.toast.danger('FORMATO DE ARCHIVO NO VÁLIDO');
            }
        }
    }

    cargarImagenTrasera(event) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            const extension = file.name.split('.').pop().toLowerCase();
            const isSuccess = this.fileTypes.indexOf(extension) > -1;
            if (isSuccess) {
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.formRegistro.patchValue({
                        imagenTrasera: { filename: `dorso-dni.${extension}`, content: reader.result }
                    });
                    this.cd.markForCheck();
                };
            } else {
                this.toast.danger('FORMATO DE ARCHIVO NO VÁLIDO');
            }
        }
    }
}
