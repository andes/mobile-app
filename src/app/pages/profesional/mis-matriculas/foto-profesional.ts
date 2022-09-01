import { Component, OnInit } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';
// providers
import { ProfesionalProvider } from 'src/providers/profesional';
import { ToastProvider } from 'src/providers/toast';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-foto-profesional',
    templateUrl: 'foto-profesional.html',
    styleUrls: ['foto-profesional.scss'],
})

export class FotoProfesionalPage implements OnInit {
    inProgress = true;
    profesional: any;
    validado = false;
    public foto = null;
    public fotoPreview = null;
    editar = false;

    constructor(
        private route: Router,
        private toast: ToastProvider,
        public authProvider: AuthProvider,
        private profesionalProvider: ProfesionalProvider,
        public sanitizer: DomSanitizer,
        private camera: Camera,
        private platform: Platform) {
    }

    ngOnInit() {
        let profesionalId;
        profesionalId = this.authProvider.user.profesionalId;

        this.profesionalProvider.getProfesionalFoto(profesionalId).then(resp => {
            this.foto = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + resp);
            this.inProgress = false;
            this.validado = true;
        });
    }

    editarFoto() {
        this.editar = true;
        this.fotoPreview = null;
    }

    cancelarFoto() {
        this.editar = false;
    }

    cancelarPreview() {
        this.fotoPreview = null;
    }

    hacerFoto() {
        const destinationType = this.platform.is('ios') ? 1 : 2;

        const options: CameraOptions = {
            quality: 50,
            correctOrientation: true,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 600,
            targetHeight: 600,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            cameraDirection: 0
        };
        this.camera.getPicture(options).then((imageData) => {
            this.fotoPreview = 'data:image/jpeg;base64,' + imageData;
        });
    }

    savePreview() {
        this.foto = this.fotoPreview;
        this.editar = false;
    }

    confirmarFoto() {

        if (this.fotoPreview) {
            const strImage = this.foto.replace(/^data:image\/[a-z]+;base64,/, '');

            const imagenPro = {
                img: strImage,
                idProfesional: this.authProvider.user.profesionalId
            };

            this.profesionalProvider.saveProfesional({ imagen: imagenPro }).then(resp => {
                this.toast.success('Foto actualizada correctamente');
                this.route.navigate(['profesional/comprobante-profesional']);
            });
        } else {
            this.route.navigate(['profesional/comprobante-profesional']);
        }

    }
}




