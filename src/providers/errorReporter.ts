
import { Injectable } from '@angular/core';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AuthProvider } from './auth/auth';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ToastProvider } from './toast';

@Injectable()
export class ErrorReporterProvider {

    constructor(
        public emailCtr: EmailComposer,
        public screenshot: Screenshot,
        private alertCtrl: AlertController,
        public storage: Storage,
        private toastCtrl: ToastProvider,
        public auth: AuthProvider) {

    }

    makeInfo() {
        if (this.auth.user) {

            let texto = '';
            texto += 'Los siguientes son datos para identificar el usuario:<br/>';
            texto += 'Nombre: ' + this.auth.user.nombre + ' ' + this.auth.user.apellido;
            texto += '<br/>';
            texto += 'Documento: ' + this.auth.user.documento;
            texto += '<br/>';
            texto += 'A continuación escriba su mensaje: <br/> ';
            return texto;
        } else {
            return '';
        }
    }

    async makeAlert() {
        const alert = await this.alertCtrl.create({
            header: 'Nueva funcionalidad',
            subHeader: 'En todas las pantallas informativas existe una opción, en la parte superior derecha, para denunciar datos incorrectos, notificar algún error de la aplicación o sugerir algún cambio.',
            buttons: ['Entiendo']
        });
        await alert.present();
    }

    alert() {
        this.storage.get('info-bug').then((present) => {
            if (!present) {
                this.makeAlert();
                this.storage.set('info-bug', true);
            }
        });

    }

    report() {
        this.screenshot.URI(80).then((data) => {
            return this.emailCtr.isAvailable().then((available) => {
                const base64RegExp = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,(.*)/;
                const match = data.URI.match(base64RegExp);

                const email = {
                    to: 'info@andes.gob.ar',
                    attachments: [
                        'base64:screenshot.jpg//' + match[2]
                    ],
                    subject: 'ANDES - Error y/o segurencia',
                    body: this.makeInfo(),
                    isHtml: true
                };
                this.emailCtr.open(email);
            }).catch(() => {
                this.toastCtrl.danger('CUENTA EMAIL NO CONFIGURADA');
            });
        }, () => {
            this.toastCtrl.danger('CUENTA EMAIL NO CONFIGURADA');
        });
    }

}

