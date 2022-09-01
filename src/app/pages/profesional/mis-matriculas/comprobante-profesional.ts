import { Component, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';
import { ENV } from 'src/environments/environment';
// providers
import { ProfesionalProvider } from 'src/providers/profesional';
import { ToastProvider } from 'src/providers/toast';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';

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
    tipoDocumento = null;
    status;
    body;

    constructor(
        private toast: ToastProvider,
        private zone: NgZone,
        private route: Router,
        public authProvider: AuthProvider,
        private profesionalProvider: ProfesionalProvider,
        public sanitizer: DomSanitizer,
        private http: HttpClient) {
    }

    ngOnInit() {
        let profesionalId;
        profesionalId = this.authProvider.user.profesionalId;
        this.inProgress = false;
        this.validado = true;
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

                this.portFile(file.files[0]).subscribe(event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.inProgress = true;
                    }

                    if (event.type === HttpEventType.Response) {
                        this.inProgress = false;
                        this.status = event.status;
                        this.body = JSON.parse(event.body as string);
                        this.body.ext = ext;
                    }
                }, (error) => {
                    this.inProgress = true;
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

    portFile(file: File) {
        const formdata: FormData = new FormData();
        formdata.append('file', file);

        const headers: HttpHeaders = new HttpHeaders({
            Authorization: 'JWT ' + this.authProvider.token
        });

        const req = new HttpRequest('POST', `${ENV.API_URL}drive`, formdata, {
            reportProgress: true,
            responseType: 'text',
            headers
        });
        return this.http.request(req);
    }

    remove() {
        this.files.splice(0, 1);
    }

    confirmarComprobante() {
        this.tipoDocumento = {
            label: 'Comprobante de pago'
        };
        if (this.status === 200) {
            const archivos = {
                id: this.body.id,
                extension: this.body.ext
            };
            const doc = {
                fecha: new Date(),
                tipo: this.tipoDocumento,
                archivo: archivos
            };
            const cambio = {
                op: 'updateDocumentos',
                data: doc
            };

            this.profesionalProvider.patchProfesional(this.authProvider.user.profesionalId, cambio).then((data) => {
                this.toast.success('La renovación de la matrícula ha iniciado correctamente');
                this.route.navigate(['home']);
            });
        }
    }

}




