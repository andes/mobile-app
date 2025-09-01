import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage-provider.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DescargaArchivosProvider {
    fileOpener = new FileOpener();

    constructor(
        private platform: Platform,
        public loadingController: LoadingController,
        private nativeHTTP: HTTP,
        private storage: StorageService,
        private http: HttpClient
    ) {}

    async loadToken() {
        return await this.storage.get('token');
    }

    public async descargarArchivo(url, nombreArchivo) {
        const token = await this.loadToken();

        if (this.platform.is('cordova')) {
            const file = new File();
            nombreArchivo = encodeURIComponent(nombreArchivo);
            const tempDir = file.tempDirectory || file.cacheDirectory;
            const filePath = tempDir + nombreArchivo;

            const headers = {
                Authorization: 'JWT ' + token,
            };
            this.nativeHTTP
                .downloadFile(url, {}, headers, filePath)
                .then((response) => {
                    this.fileOpener
                        .showOpenWithDialog(response.nativeURL, '')
                        .then((result) => {
                            console.info({ result });
                        })
                        .catch((e) => {
                            console.error('Error al abrir el archivo', e);
                            this.loadingController.dismiss();
                        });
                })
                .catch((err) => {
                    console.info('Status: ', err.status);
                    console.error('Error: ', err.error);
                });
        } else {
            window.open(url);
        }
    }

    public async abrirArchivoDesdeRuta(
        url: string,
        body: any,
        nombreArchivo: string
    ) {
        try {
            const token = await this.loadToken();

            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'JWT ' + token,
            });

            const responseBlob = await this.http
                .post(url, body, {
                    headers: headers,
                    responseType: 'blob',
                })
                .toPromise();

            if (!responseBlob) {
                console.error('La respuesta del servidor no contiene datos.');
                return;
            }
            if (this.platform.is('cordova')) {
                this.abrirArchivoDevice(nombreArchivo, responseBlob);
            } else {
                this.abrirArchivoWeb(responseBlob);
            }

            return true;
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
            throw error;
        }
    }

    private async abrirArchivoDevice(
        nombreArchivo: string,
        responseBlob: Blob
    ) {
        const file = new File();
        const path = file.tempDirectory || file.cacheDirectory;
        await file.checkDir(path, '').catch(async () => {
            await file.createDir(path, '', false);
        });

        await file.writeFile(path, nombreArchivo, responseBlob, {
            replace: true,
        });

        await this.fileOpener
            .open(`${path}${nombreArchivo}`, 'application/pdf')
            .catch((e) =>
                console.error('Error al intentar abrir el archivo:', e)
            );
    }

    private abrirArchivoWeb(blob: Blob) {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
    }
}
