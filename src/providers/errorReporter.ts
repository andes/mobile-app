
import { Injectable } from '@angular/core';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AuthProvider } from './auth/auth';
import { AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ToastProvider } from 'src/providers/toast';

@Injectable()
export class ErrorReporterProvider {

    constructor(
        public emailCtr: EmailComposer,
        public screenshot: Screenshot,
        private alertCtrl: AlertController,
        private toastCtrl: ToastProvider,
        public storage: Storage,
        public auth: AuthProvider,
        private platform: Platform
    ) {

    }

    public header = 'Nueva funcionalidad';
    public subHeader = 'Para reportar errores, hacer consultas o simplemente dejar un mensaje, podés ir a "Consultas y sugerencias" en el menú desplegable';


    makeInfo() {
        if (this.auth.user) {
            const texto = `
                Los siguientes son datos para identificar al usuario:<br>
                Nombre: <b>${this.auth.user.nombre} ${this.auth.user.apellido}</b>
                <br>
                Documento: <b>${this.auth.user.documento}</b>
                <br>
                Escriba su mensaje, consulta o sugerencia: <br>`;
            return texto;
        } else {
            return `
                <br>
                Escriba su mensaje, consulta o sugerencia: <br>
            `;
        }
    }

    async report() {

        const datos = {
            header: 'Enviar consulta sobre esta página',
            subHeader: 'Se va a abrir la app de e-mail de su celular',
            message: 'Puede ingresar su consulta o repotar algún problema. La misma puede ir junto a sus datos básicos y una captura de la pantalla actual de Andes.'
        };

        const alert = await this.alertCtrl.create({
            header: datos.header || this.header,
            subHeader: datos.subHeader || this.subHeader,
            message: datos.message || '',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (cancel) => {
                        console.log('Cancelado', cancel);
                        return false;
                    }
                }, {
                    text: 'Aceptar',
                    handler: () => {
                        console.log('Confirmado');
                        this.email();
                        return true;
                    }
                }
            ]
        });
        await alert.present();
    }

    alert() {
        this.storage.get('info-bug').then((present) => {
            if (!present) {
                this.report();
                this.storage.set('info-bug', true);
            }
        });
    }

    email() {
        if (this.platform.is('cordova')) {
            setTimeout(() => {
                this.screenshot.URI(80).then((data) => {
                    return this.emailCtr.isAvailable().then(async (available) => {
                        const base64RegExp = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,(.*)/;
                        const match = data.URI.match(base64RegExp);

                        const email = {
                            to: 'info@andes.gob.ar',
                            attachments: [
                                'base64:screenshot.jpg//' + match[2]
                            ],
                            subject: 'ANDES - Errores y sugerencias',
                            body: this.makeInfo(),
                            isHtml: true
                        };
                        this.emailCtr.open(email).then(() => {
                            this.toastCtrl.success('El correo electrónico se envió correctamente.');
                        });
                    }).catch((err) => {
                        console.error('Error: Envío de emails no configurado.', err);
                        this.toastCtrl.danger('Error: Envío de emails no configurado.');
                    });
                }, (err) => {
                    console.error('Error: No se pudo realizar la captura.', err);
                    this.toastCtrl.danger('Error: No se pudo realizar la captura.');
                });
            }, 200);
        } else {
            console.error('[cordova plugin] Envío de emails sólo funciona en dispositivos.');
            this.toastCtrl.danger('Error: No se pudo abrir la app de E-mail.');
        }
    }

}

