import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';
// providers
import { ProfesionalProvider } from 'src/providers/profesional';
import { ToastProvider } from 'src/providers/toast';
import { FormBuilder } from '@angular/forms';

import SignaturePad from 'signature_pad';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-firma-profesional',
    templateUrl: 'firma-profesional.html',
    styleUrls: ['firma-profesional.scss'],
})

export class FirmaProfesionalPage implements OnInit {
    inProgress = true;
    profesional: any;
    validado = false;

    public urlFirma = null;
    public base64Data = null;
    public editar = false;
    signaturePad: SignaturePad;
    @ViewChild('canvas') canvasEl: ElementRef;
    signatureImg;

    constructor(
        private route: Router,
        private toast: ToastProvider,
        public authProvider: AuthProvider,
        private profesionalProvider: ProfesionalProvider,
        public sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        let profesionalId;
        profesionalId = this.authProvider.user.profesionalId;
        this.profesionalProvider.getProfesionalFirma(profesionalId).then(resp => {
            this.urlFirma = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + resp);
            this.inProgress = false;
            this.validado = true;
        });
    }

    editarFirma() {
        this.editar = true;

        setTimeout(() => {
            this.signaturePad = new SignaturePad(this.canvasEl.nativeElement, {
                backgroundColor: 'rgb(255, 255, 255)',
                'velocityFilterWeight': 0.9
            });
        }, 500);
    }

    confirmarFirma() {

        if (this.base64Data) {
            let strImage = this.base64Data.replace(/^data:image\/[a-z]+;base64,/, "");

            const firmaProfesional = {
                firmaP: strImage,
                idProfesional: this.authProvider.user.profesionalId
            };

            this.profesionalProvider.saveProfesional({ firma: firmaProfesional }).then(resp => {
                this.toast.success('Firma Actualizada correctamente');
                this.route.navigate(['profesional/foto-profesional']);
            });
        } else {
            this.route.navigate(['profesional/foto-profesional']);
        }
    }

    cancelarFirma() {
        this.base64Data = null;
        this.editar = false;
    }

    clearPad() {
        this.signaturePad.clear();
    }

    savePad() {
        this.base64Data = this.signaturePad.toDataURL("image/jpeg", 0.5);
        this.urlFirma = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Data);
        this.editar = false;
    }

}




