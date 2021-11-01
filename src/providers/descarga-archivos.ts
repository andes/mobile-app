import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Injectable } from '@angular/core';

@Injectable()
export class DescargaArchivosProvider {
    constructor(
        private platform: Platform,
        public loadingController: LoadingController,
        private nativeHTTP: HTTP
    ) { }

    public async descargarArchivo(url, nombreArchivo) {
        console.log('nombreArchivo ', nombreArchivo);
        if (this.platform.is('cordova')) {


            let filePath;

            if (this.platform.is('ios')) {
                filePath = new File().documentsDirectory + nombreArchivo;
            } else if (this.platform.is('android')) {
                filePath = new File().dataDirectory + nombreArchivo;
            } else {
                window.open(url);
                return;
            }

            this.nativeHTTP.downloadFile(url, {}, {}, filePath).then(response => {
                console.log('Success', response);
                new FileOpener().showOpenWithDialog(response.toURL(), '')
                    .then(() => {
                        // this.loadingController.dismiss();
                    })
                    .catch(e => {
                        console.error('Error al abrir el archivo', e);
                        this.loadingController.dismiss();
                    });
            }).catch(err => {
                console.log('Status: ', err.status);
                console.log('Error: ', err.error);
            })


            //     const localFile = `${File.dataDirectory}${nombreArchivo}`;
            //     const fileTransfer: FileTransferObject = this.transfer.create();
            //     console.log('localFile ', localFile);
            //     fileTransfer.download(url, localFile, true).then((entry) => {
            //         new FileOpener().showOpenWithDialog(entry.toURL(), '')
            //         .then(() => {
            //             // this.loadingController.dismiss();
            //         })
            //         .catch(e => {
            //             console.error('Error al abrir el archivo', e);
            //             this.loadingController.dismiss();
            //         });
            //     }, (error: any) => {
            //         console.error('error', error);
            //     });
            // } else {
            //     window.open(url);
        }
    }
}

