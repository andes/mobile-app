import { Component } from '@angular/core';
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
export class RupAdjuntarPage {
  mostrarMenu: boolean = true;
  id: string = null;
  adjunto: any;
  inProgress = false;
  extension = ['png', 'bmp', 'jpg', 'jpeg', 'png', 'pdf'];

  files: any[] = [];

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
    let notification = this.navParams.get('notification');
    this.id = notification.additionalData.id;
    this.rup.get({ id: this.id }).then((data : any[]) => {
      this.inProgress = false;
      this.adjunto = data[0];
      this.adjunto.fecha = moment(this.adjunto.fecha);
    }).catch(() => {
      this.inProgress = false;
    //   this.toast.danger('PROBLEMA DE CONEXION');
      this.navCtrl.pop();
    });
    // console.log(notification);
  }

  ngOnDestroy() {
    this.onResumeSubscription.unsubscribe();
  }

  takePhoto () {
    let options = {
        quality: 80, // 80
        correctOrientation: true,
        destinationType: 2 // NATIVE_URI
      } as CameraOptions;

      // sacamos la foto
      this.camera.getPicture(options).then((imageData) => {
        this.base64.encodeFile(imageData).then((base64File: string) => {

            let img: any = this.sanitizer.bypassSecurityTrustResourceUrl(base64File);

            this.files.push({
                ext: 'jpg',
                file: img
            });

        });
      });
  }

  fileExtension(file) {
    return file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2);
  }

  chooseFile () {
    this.fileChooser.open().then(uri => {
        this.filePath.resolveNativePath(uri)
        .then(filePath => {
            let ext = this.fileExtension(filePath);

            if (this.extension.indexOf(ext) >= 0) {

                this.base64.encodeFile(filePath).then((base64File: string) => {
                    let img: any = (ext === 'pdf' ? base64File : (this.sanitizer.bypassSecurityTrustResourceUrl(base64File) as any));

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
        .catch(err => console.log(err));

    }).catch(e => {
        console.log(e)
    });
  }

  upload () {
    console.log(this.files);
    let valores = [];
    this.files.forEach(item => {
        let elem = {
            ext: item.ext,
            file: item.plain64
        }
        valores.push(elem);;
    });

    this.rup.patch(this.adjunto._id, {valor: valores, estado: 'upload'}).then(() => {
        // this.toast.success('Todo bien');
        this.navCtrl.pop();
    }).catch(() => {

    });

  }

  remove(i) {
      this.files.splice(i, 1);
  }
}
