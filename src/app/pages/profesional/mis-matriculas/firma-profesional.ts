import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';
// providers
import { ProfesionalProvider } from 'src/providers/profesional';
import { ToastProvider } from 'src/providers/toast';
import SignaturePad from 'signature_pad';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-firma-profesional',
    templateUrl: 'firma-profesional.html',
    styleUrls: ['firma-profesional.scss'],
})

export class FirmaProfesionalPage implements OnInit {
    @ViewChild('canvas') canvasEl: ElementRef;

    public inProgress = true;
    public profesional: any;
    public urlFirma = null;
    public base64Data = null;
    public signaturePad: SignaturePad;
    public disabledGuardar = true;

    constructor(
        public authProvider: AuthProvider,
        private router: Router,
        private toast: ToastProvider,
        private profesionalProvider: ProfesionalProvider,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.inProgress = false;
        this.editarFirma();
    }

    editarFirma() {
        setTimeout(() => {
            this.signaturePad = new SignaturePad(this.canvasEl.nativeElement, {
                backgroundColor: 'rgb(255, 255, 255)',
                velocityFilterWeight: 0.9
            });
            this.signaturePad.addEventListener('endStroke', () => {
                this.updateDisabledGuardar();
            });
            this.updateDisabledGuardar();
        }, 500);
    }

    confirmarFirma() {
        this.signaturePad.off();
        this.base64Data = this.signaturePad.toDataURL('image/jpeg', 0.5);
        this.urlFirma = this.sanitizer.bypassSecurityTrustResourceUrl(this.base64Data);

        if (this.base64Data) {
            const strImage = this.base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

            const firmaProfesional = {
                firmaP: strImage,
                idProfesional: this.authProvider.user.profesionalId
            };
            this.profesionalProvider.saveProfesional({ firma: firmaProfesional }).then(() => {
                this.toast.success('Firma Actualizada correctamente');
                this.signaturePad.on();
                this.router.navigate(['profesional/foto-profesional']);
            });
        }
    }

    clearPad() {
        this.signaturePad.clear();
        this.updateDisabledGuardar();
    }

    updateDisabledGuardar() {
        this.disabledGuardar = this.signaturePad.isEmpty();
    }
}




