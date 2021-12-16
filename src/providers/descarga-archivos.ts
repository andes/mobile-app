import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Injectable } from '@angular/core';
import { StorageService } from './storage-provider.service';

@Injectable()
export class DescargaArchivosProvider {
    token: any;
    constructor(
        private platform: Platform,
        public loadingController: LoadingController,
        private nativeHTTP: HTTP,
        private storage: StorageService

    ) { }

    public async descargarArchivo(url, nombreArchivo) {

        this.storage.get('token').then(token => {
            this.token = token;
        });

        console.log('nombreArchivo ', nombreArchivo);


        if (this.platform.is('ios')) {

            nombreArchivo = encodeURIComponent(nombreArchivo);

            let filePath;

            let file = new File();
            filePath = file.tempDirectory + nombreArchivo;

            const headers = {
                Authorization: 'JWT ' + this.token
            };

            this.nativeHTTP.downloadFile(url, {}, headers, filePath).then(response => {
                console.log('Success', response.toURL(), response);

                const fileOpener = new FileOpener();
                fileOpener.showOpenWithDialog(response.nativeURL, '')
                    .then(result => {
                        console.log({ result });
                    })
                    .catch(e => {
                        console.error('Error al abrir el archivo', e);
                        this.loadingController.dismiss();
                    });
            }).catch(err => {
                console.log('Status: ', err.status);
                console.log('Error: ', err.error);
            });


            // const localFile = `${File.dataDirectory}${nombreArchivo}`;
            // const fileTransfer: FileTransferObject = this.transfer.create();
            // console.log('localFile ', localFile);
            // fileTransfer.download(url, localFile, true).then((entry) => {
            //     new FileOpener().showOpenWithDialog(entry.toURL(), '')
            //     .then(() => {
            //         // this.loadingController.dismiss();
            //     })
            //     .catch(e => {
            //         console.error('Error al abrir el archivo', e);
            //         this.loadingController.dismiss();
            //     });
            // }, (error: any) => {
            //     console.error('error', error);
            // });
        } else {
            window.open(url);
        }
    }
}

