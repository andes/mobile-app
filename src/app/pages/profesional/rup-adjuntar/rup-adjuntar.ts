import { Component, OnDestroy, ViewChildren, QueryList, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
// providers
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { RupProvider } from 'src/providers/rup';
import { ToastProvider } from 'src/providers/toast';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-rup-adjuntar',
    templateUrl: 'rup-adjuntar.html'
})
export class RupAdjuntarPage implements OnDestroy {
    @ViewChildren('upload') childsComponents: QueryList<any>;

    id: string = null;
    adjunto: any;
    inProgress = false;
    extension = ['png', 'bmp', 'jpg', 'jpeg', 'png', 'pdf'];
    files: any[] = [];

    uploading = false;

    private onResumeSubscription: Subscription;

    constructor(
        private rup: RupProvider,
        private platform: Platform,
        private zone: NgZone,
        private toast: ToastProvider,
        private camera: Camera,
        private sanitizer: DomSanitizer,
        private router: Router,
        private route: ActivatedRoute
    ) {

        this.onResumeSubscription = platform.resume.subscribe(() => {
        });
    }

    ionViewWillEnter() {
        this.inProgress = true;
        this.route.queryParams.subscribe(params => {
            this.id = params.id;
        });

        this.rup.get({ id: this.id }).then((data: any[]) => {
            this.inProgress = false;
            this.adjunto = data[0];
            this.adjunto.fecha = moment(this.adjunto.fecha);
        }).catch(() => {
            this.inProgress = false;
            this.router.navigate(['profesional/consultorio']);
        });
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

    takePhoto() {
        let item;
        const destinationType = this.platform.is('ios') ? 1 : 2;
        // const fileName = this.platform.is('ios') ? 'rup-adjuntos' : null;
        const options: CameraOptions = {
            // quality: 70,
            quality: 30,
            correctOrientation: true,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 600,
            targetHeight: 600,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then((imageData) => {
            item = {
                loading: true
            };
            this.files.push(item);
            return 'data:image/jpeg;base64,' + imageData;
        }).then((base64File: string) => {
            const img: any = this.sanitizer.bypassSecurityTrustResourceUrl(base64File);
            item.ext = 'jpg';
            item.file = img;
            item.plain64 = base64File;
            item.loading = false;
            this.files = [...this.files];
        }).catch(() => {
            this.toast.danger('El servicio momentaneamente no se encuentra disponible. Utilice la opción "Adjuntar"');
        });
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

    uploadFile() {
        this.zone.run(() => {
            this.uploading = true;
        });
        const valores = [];
        this.files.forEach(item => {
            const elem = {
                ext: item.ext,
                plain64: item.plain64
            };
            valores.push(elem);
        });
        this.rup.patch(this.adjunto._id, { valor: { documentos: valores }, estado: 'upload' }).then(() => {
            this.uploading = false;
            this.router.navigate(['home']);
        }).catch(() => {
            this.uploading = false;
        });
    }

    remove(i) {
        this.files.splice(i, 1);
    }
}
