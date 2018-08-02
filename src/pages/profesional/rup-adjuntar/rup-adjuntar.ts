import { Component, OnDestroy, ViewChildren, QueryList } from '@angular/core';
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
            quality: 80, // 80
            correctOrientation: true,
            destinationType
        } as CameraOptions;

        this.camera.getPicture(options).then((imageData) => {
            let optionsResize = {
                uri: imageData,
                fileName,
                quality: 80, // 70
                width: 600,
                height: 600
            } as ImageResizerOptions;

            item = {
                loading: true
            };
            this.files.push(item);

            return this.imageResizer.resize(optionsResize);
        }).then((filePath: string) => {
            return this.base64.encodeFile(filePath);
        }).then((base64File: string) => {
            let img: any = this.sanitizer.bypassSecurityTrustResourceUrl(base64File);
            item.ext = 'jpg';
            item.file = img;
            item.plain64 = base64File;
            item.loading = false;
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
                this.getBase64(file.files[0]).then((base64) => {
                    debugger;
                    (this.childsComponents.first as any).nativeElement.value = '';

                });
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

    chooseFile() {
        this.fileChooser.open().then(uri => {
            this.filePath.resolveNativePath(uri)
                .then(filePath => {
                    let ext = this.fileExtension(filePath);

                    if (this.extension.indexOf(ext) >= 0) {

                        this.base64.encodeFile(filePath).then((base64File: string) => {
                            let img: any;
                            if (ext === 'pdf') {
                                img = base64File.replace('image/*', 'application/pdf');
                            } else {
                                img = this.sanitizer.bypassSecurityTrustResourceUrl(base64File);
                                base64File = img.changingThisBreaksApplicationSecurity;
                            }
                            this.files.push({
                                ext: ext,
                                file: img,
                                plain64: base64File
                            });
                        });

                    } else {
                        this.toast.danger('TIPO DE ARCHIVO INVALIDO');
                    }

                })
                .catch(err => false);

        }).catch(e => {
            // console.log(e)
        });
    }

    upload() {
        let valores = [];
        this.files.forEach(item => {
            let elem = {
                ext: item.ext,
                plain64: item.plain64
            }
            valores.push(elem); ;
        });
        this.uploading = true;
        this.rup.patch(this.adjunto._id, { valor: { documentos: valores }, estado: 'upload' }).then(() => {
            // this.toast.success('Todo bien');
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
