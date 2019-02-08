import { Component, OnDestroy, ViewChildren, QueryList, NgZone } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { Base64 } from '@ionic-native/base64';
import { FileChooser } from '@ionic-native/file-chooser';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthProvider } from '../../../providers/auth/auth';
import { RupProvider } from '../../../providers/rup';
import { FilePath } from '@ionic-native/file-path';
import { ToastProvider } from '../../../providers/toast';

@Component({
    selector: 'page-rup-adjuntar',
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
        public navCtrl: NavController,
        public navParams: NavParams,
        public rup: RupProvider,
        public authProvider: AuthProvider,
        public platform: Platform,
        private zone: NgZone,
        public toast: ToastProvider,
        private fileChooser: FileChooser,
        private camera: Camera,
        private imageResizer: ImageResizer,
        private base64: Base64,
        private sanitizer: DomSanitizer,
        private filePath: FilePath) {

        this.onResumeSubscription = platform.resume.subscribe(() => {

        });

        this.inProgress = true;
        this.id = this.navParams.get('id');

        this.rup.get({ id: this.id }).then((data: any[]) => {
            this.inProgress = false;
            this.adjunto = data[0];
            this.adjunto.fecha = moment(this.adjunto.fecha);
        }).catch(() => {
            this.inProgress = false;
            this.navCtrl.pop();
        });
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

    takePhoto() {
        let item;
        let destinationType = this.platform.is('ios') ? 1 : 2;
        let fileName = this.platform.is('ios') ? 'rup-adjuntos' : null;
        let options = {
            quality: 70,
            correctOrientation: true,
            destinationType,
            targetWidth: 600,
            targetHeight: 600,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        } as CameraOptions;

        this.camera.getPicture(options).then((imageData) => {
            item = {
                loading: true
            };
            this.files.push(item);
            return imageData;
        }).then((filePath: string) => {
            return this.base64.encodeFile(filePath);
        }).then((base64File: string) => {
            let img: any = this.sanitizer.bypassSecurityTrustResourceUrl(base64File);
            item.ext = 'jpg';
            item.file = img;
            item.plain64 = base64File;
            item.loading = false;
            this.files = [...this.files];
        });
    }

    fileExtension(file) {
        return file.slice((file.lastIndexOf('.') - 1 >>> 0) + 2);
    }

    changeListener($event) {
        let file = $event.target;
        if (file) {
            let ext = this.fileExtension(file.value);
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
                            ext: ext,
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
        let valores = [];
        this.files.forEach(item => {
            let elem = {
                ext: item.ext,
                plain64: item.plain64
            }
            valores.push(elem);
        });
        this.rup.patch(this.adjunto._id, { valor: { documentos: valores }, estado: 'upload' }).then(() => {
            this.navCtrl.pop();
            this.uploading = false;
        }).catch(() => {
            this.uploading = false;
        });
    }

    remove(i) {
        this.files.splice(i, 1);
    }
}
