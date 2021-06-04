import { LoadingController, Platform } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '../../node_modules/@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Injectable } from '@angular/core';

@Injectable()
export class DescargaArchivosProvider {
    constructor(
        private platform: Platform,
        public loadingController: LoadingController,
        private transfer: FileTransfer

    ) { }

    public descargarArchivo(url, nombreArchivo) {
        console.log('nombreArchivo ', nombreArchivo);
        if (this.platform.is('cordova')) {
            const localFile = `${File.dataDirectory}${nombreArchivo}`;
            const fileTransfer: FileTransferObject = this.transfer.create();
            console.log('localFile ', localFile);
            fileTransfer.download(url, localFile, true).then((entry) => {
                new FileOpener().showOpenWithDialog(entry.toURL(), '')
                .then(() => {
                    // this.loadingController.dismiss();
                })
                .catch(e => {
                    console.error('Error al abrir el archivo', e);
                    this.loadingController.dismiss();
                });
            }, (error: any) => {
                console.error('error', error);
            });
        } else {
            window.open(url);
        }
    }
}
