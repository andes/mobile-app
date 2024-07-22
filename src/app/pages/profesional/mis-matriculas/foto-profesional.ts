import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';
// providers
import { ProfesionalProvider } from 'src/providers/profesional';
import { ToastProvider } from 'src/providers/toast';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-foto-profesional',
    templateUrl: 'foto-profesional.html',
    styleUrls: ['foto-profesional.scss'],
})

export class FotoProfesionalPage implements OnInit {
    @ViewChildren('upload') childsComponents: QueryList<any>;

    public inProgress = true;
    public profesional: any;
    public validado = false;
    public foto = null;
    public editar = true;
    public extension = ['jpg', 'jpeg', 'png', 'bmp'];
    public files: any[] = [];

    constructor(
        private router: Router,
        private toast: ToastProvider,
        private camera: Camera,
        private profesionalProvider: ProfesionalProvider,
        public authProvider: AuthProvider,
        public sanitizer: DomSanitizer
    ) {
    }

    ngOnInit() {
        this.inProgress = false;
    }

    editarFoto() {
        this.editar = true;
    }

    cancelarEdicion() {
        this.editar = false;
    }

    hacerFoto() {
        const options: CameraOptions = {
            quality: 50,
            correctOrientation: true,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 400,
            targetHeight: 600,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            cameraDirection: 0
        };

        this.camera.getPicture(options).then((imageData) => {
            this.foto = 'data:image/jpeg;base64,' + imageData;
            this.cancelarEdicion();
        }, () => {
            this.toast.danger('El servicio momentaneamente no se encuentra disponible. Utilice la opción "Examinar"');
        });
    }

    confirmarFoto() {
        if (this.foto) {
            const strImage = this.foto.replace(/^data:image\/[a-z]+;base64,/, '');
            let matriculaNumero = 0;
            if (this.profesionalProvider.formacionGradoSelected?.value?.matriculacion?.length > 0) {
                matriculaNumero = this.profesionalProvider.formacionGradoSelected.value.matriculacion[this.profesionalProvider.formacionGradoSelected.value.matriculacion?.length - 1].matriculaNumero;

            }
            const imagenPro = {
                img: strImage,
                idProfesional: this.authProvider.user.profesionalId,
                matricula: matriculaNumero,
                option: 'renovacionOnline'
            };

            this.profesionalProvider.updateProfesional(imagenPro.idProfesional, { imagen: imagenPro }).then(() => {
                this.toast.success('Foto actualizada correctamente');
                this.router.navigate(['profesional/comprobante-profesional']);
            });
        } else {
            this.router.navigate(['profesional/comprobante-profesional']);
        }
    }

    getExtension(file) {
        if (file.lastIndexOf('.') >= 0) {
            return file.slice((file.lastIndexOf('.') + 1));
        } else {
            return '';
        }
    }

    changeListener($event) {
        const file = $event.target;
        if (file) {
            const ext = this.getExtension(file.files[0].name).toLowerCase();
            if (this.extension.indexOf(ext) >= 0) {
                this.getBase64(file.files[0]).then((base64File: string) => {
                    this.foto = base64File;
                    this.cancelarEdicion();
                });
            } else {
                this.toast.danger('TIPO DE ARCHIVO INVALIDO');
            }
        }
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}
