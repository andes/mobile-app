import { Component, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';
import { ENV } from 'src/environments/environment';
// providers
import { ProfesionalProvider } from 'src/providers/profesional';
import { ToastProvider } from 'src/providers/toast';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import * as moment from 'moment';

@Component({
    selector: 'app-comprobante-profesional',
    templateUrl: 'comprobante-profesional.html',
    styleUrls: ['comprobante-profesional.scss'],
})

export class ComprobanteProfesionalPage implements OnInit {
    @ViewChildren('upload') childsComponents: QueryList<any>;

    public inProgress = true;
    public validado = false;
    public extension = ['jpg', 'jpeg', 'pdf'];
    public fileToDB: any;
    public editar = true;
    public tipoDocumento = null;
    public documentoPreview = null;
    public documentoNombre = null;
    private status;
    private body;

    constructor(
        private toast: ToastProvider,
        private zone: NgZone,
        private router: Router,
        private http: HttpClient,
        private profesionalProvider: ProfesionalProvider,
        private camera: Camera,
        public authProvider: AuthProvider,
        public sanitizer: DomSanitizer,
        private file: File
    ) { }

    ngOnInit() {
        this.inProgress = false;
        this.validado = true;
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
            destinationType: this.camera.DestinationType.FILE_URI,
            targetWidth: 400,
            targetHeight: 600,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        this.camera.getPicture(options).then(async img64 => {
            this.documentoPreview = (window as any).Ionic.WebView.convertFileSrc(img64);

            const base64 = await this.file.readAsDataURL(
                img64.substring(0, img64.lastIndexOf('/') + 1),
                img64.substring(img64.lastIndexOf('/') + 1)
            );

            const rawBase64 = base64.split(',')[1];
            const contentType = 'image/jpeg';
            const dataBlob = this.base64toBlob(rawBase64);

            this.portFile(dataBlob, 'jpeg').subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.inProgress = false;
                }
                if (event.type === HttpEventType.Response) {
                    this.inProgress = false;
                    this.status = event.status;
                    this.body = JSON.parse(event.body as string);
                    this.body.ext = contentType;
                }
            }, () => {
                this.inProgress = false;
                this.toast.danger('Ocurrió un error guardando el archivo');
            });
            this.cancelarEdicion();
        }, () => {
            this.toast.danger('El servicio momentaneamente no se encuentra disponible. Utilice la opción "Examinar"');
        });
    }

    // convierte una imagen en base64 a objeto blob
    // necesario para almacenar en drive una img sacada desde la camara
    public base64toBlob(b64Data) {
        const sliceSize = 512;
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, {
            type: 'image/jpeg'
        });
        return blob;
    }

    getExtension(file) {
        if (file.lastIndexOf('.') >= 0) {
            return file.slice((file.lastIndexOf('.') + 1));
        } else {
            return '';
        }
    }

    changeListener($event) {
        if ($event) { $event.stopPropagation(); }
        const file = $event.target;
        if (file) {
            const ext = this.getExtension(file.files[0].name).toLowerCase();
            this.documentoNombre = file.files[0].name.slice();

            if (this.extension.indexOf(ext) >= 0) {
                this.getBase64(file.files[0]).then((base64File: string) => {
                    (this.childsComponents.first as any).nativeElement.value = '';
                    let img: any;
                    this.documentoPreview = base64File;
                    if (ext === 'pdf') {
                        img = base64File.replace('image/*', 'application/pdf');
                        this.documentoPreview = 'assets/img/pdf.png';
                    } else {
                        img = this.sanitizer.bypassSecurityTrustResourceUrl(base64File);
                        base64File = img.changingThisBreaksApplicationSecurity;
                    }
                    this.inProgress = false;
                    this.cancelarEdicion();

                    this.zone.run(() => {
                        this.fileToDB = {
                            ext,
                            file: img,
                            plain64: base64File
                        };
                    });
                });
                this.portFile(file.files[0], ext).subscribe(event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.inProgress = false;
                    }

                    if (event.type === HttpEventType.Response) {
                        this.inProgress = false;
                        this.status = event.status;
                        this.body = JSON.parse(event.body as string);
                        this.body.ext = ext;
                    }
                }, () => {
                    this.inProgress = false;
                    this.toast.danger('Ocurrió un error guardando el archivo');
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

    portFile(file, ext) {
        this.inProgress = true;
        const formdata: FormData = new FormData();
        const dataName = `comprobante ${this.authProvider.user.apellido} ${moment().format('hh:mm')}.${ext}`;

        formdata.append('file', file, dataName);

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


    confirmarComprobante(event: Event) {
        event.stopPropagation();
        this.tipoDocumento = {
            label: 'Comprobante de pago'
        };
        if (this.status === 200) {
            const archivo = {
                id: this.body.id,
                extension: this.body.ext
            };
            const doc = {
                fecha: new Date(),
                tipo: this.tipoDocumento,
                archivo
            };
            const cambio = {
                idProfesional: this.authProvider.user.profesionalId,
                op: 'updateDocumentos',
                data: doc
            };

            this.profesionalProvider.updateProfesional(cambio.idProfesional, { documentos: cambio }).then((profesional: any) => {
                if (profesional) {
                    const formacionGradoSelected = this.profesionalProvider.formacionGradoSelected.getValue();
                    const index = profesional.formacionGrado.findIndex(fg => fg.id === formacionGradoSelected.id);
                    if (index > -1) {
                        profesional.formacionGrado[index].papelesVerificados = false;
                        profesional.formacionGrado[index].renovacion = true;
                        profesional.formacionGrado[index].renovacionOnline = {
                            estado: 'pendiente',
                            fecha: new Date()
                        };
                        const data = {
                            op: 'updateEstadoGrado',
                            data: profesional.formacionGrado
                        };
                        this.profesionalProvider.patchProfesional(this.authProvider.user.profesionalId, data).then(() => {
                            this.toast.success('La renovación de la matrícula ha iniciado correctamente');
                            this.router.navigate(['profesional/mis-matriculas']);
                        });
                    }
                } else {
                    this.toast.danger('Ha ocurrido un error guardando el comprobante. Inténtelo nuevamente');
                }

            }, () => {
                this.toast.danger('Ha ocurrido un error. No se pudo finalizar el proceso de renovación');
                this.router.navigate(['home']);
            });
        }
    }
}




