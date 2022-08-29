import { AfterViewInit, Component, ElementRef, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { ActivatedRoute } from '@angular/router';
// providers
import { ProfesionalProvider } from 'src/providers/profesional';
import { ToastProvider } from 'src/providers/toast';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-comprobante-profesional',
    templateUrl: 'comprobante-profesional.html',
    styleUrls: ['comprobante-profesional.scss'],
})

export class ComprobanteProfesionalPage implements OnInit {
    @ViewChildren('upload') childsComponents: QueryList<any>;
    inProgress = true;
    profesional: any;
    validado = false;
    extension = ['jpg', 'jpeg', 'pdf'];
    files: any[] = [];
    editar = false;

    constructor(
        private toast: ToastProvider,
        private zone: NgZone,
        public authProvider: AuthProvider,
        private profesionalProvider: ProfesionalProvider,
        public sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        let profesionalId;
        profesionalId = this.authProvider.user.profesionalId;
        this.inProgress = false;
        this.validado = true;
    }

    fileExtension(file) {
        // tslint:disable-next-line: no-bitwise
        return file.slice((file.lastIndexOf('.') - 1 >>> 0) + 2);
    }

    changeListener($event) {
        const file = $event.target;
        if (file) {
            const ext = this.fileExtension(file.value).toLowerCase();
            if (this.extension.indexOf(ext) >= 0) {
                this.getBase64(file.files[0]).then((base64File: string) => {
                    (this.childsComponents.first as any).nativeElement.value = '';
                    let img: any;
                    if (ext === 'pdf') {
                        img = base64File.replace('image/*', 'application/pdf');
                    } else {
                        img = this.sanitizer.bypassSecurityTrustResourceUrl(base64File);
                        base64File = img.changingThisBreaksApplicationSecurity;
                    }
                    this.zone.run(() => {
                        this.files.push({
                            ext,
                            file: img,
                            plain64: base64File
                        });
                        this.files = [...this.files];
                    });

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

    remove(i) {
        this.files.splice(i, 1);
    }

    confirmarComprobante() {
        this.toast.success('La renovación de la matrícula ha iniciado correctamente');
    }

}




