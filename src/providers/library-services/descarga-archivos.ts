import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { HTTP, HTTPResponse } from '@awesome-cordova-plugins/http/ngx';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage-provider.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DescargaArchivosProvider {
    file = new File();
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
            nombreArchivo = encodeURIComponent(nombreArchivo);

            const filePath = this.file.tempDirectory + nombreArchivo;

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

            if (this.platform.is('cordova')) {
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: 'JWT ' + token,
                };
                const jsonBody = JSON.stringify(body);
                let response: HTTPResponse;
                try {
                    response = await this.nativeHTTP.post(
                        url,
                        jsonBody,
                        headers
                    );
                } catch (httpError) {
                    // Manejo específico de errores de nativeHttp
                    console.error(
                        'Error en la solicitud HTTP nativa:',
                        httpError
                    );
                }

                // Verificar si la respuesta fue exitosa
                if (response.status < 200 || response.status >= 300) {
                    console.error(
                        `Error del servidor (${response.status}):`,
                        response.error
                    );
                }

                const fileArrayBuffer = response.data as ArrayBuffer;
                const fileBlob = new Blob([fileArrayBuffer], {
                    type: 'application/pdf',
                });

                // Usamos los inyectados 'file' y 'fileOpener'
                const tempDirectory = this.file.tempDirectory;

                // Asegúrate de que el directorio temporal exista (generalmente ya existe)
                await this.file.checkDir(tempDirectory, '').catch(async () => {
                    await this.file.createDir(tempDirectory, '', false);
                });

                await this.file.writeFile(
                    tempDirectory,
                    nombreArchivo,
                    fileBlob,
                    {
                        replace: true,
                    }
                );
                console.log(
                    `Archivo temporal creado en: ${tempDirectory}${nombreArchivo}`
                );

                await this.fileOpener
                    .open(`${tempDirectory}${nombreArchivo}`, 'application/pdf') // Usa la función para tipo MIME
                    .catch((e) =>
                        console.error('Error al intentar abrir el archivo:', e)
                    );
            } else {
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
                    console.error(
                        'La respuesta del servidor no contiene datos.'
                    );
                    return;
                }
                this.abrirArchivoWeb(responseBlob, nombreArchivo);
            }

            return true;
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
            throw error; // Propagar el error para que sea manejado por el llamador
        }
    }

    // --- Funciones auxiliares ---

    private abrirArchivoWeb(blob: Blob, nombreArchivo: string) {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
        console.log(`Archivo abierto en el navegador: ${nombreArchivo}`);
    }
}
