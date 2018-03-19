
import { Injectable } from '@angular/core';
import { Screenshot } from '@ionic-native/screenshot';
import { EmailComposer } from '@ionic-native/email-composer';
import { AuthProvider } from './auth/auth';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class ErrorReporterProvider {

    constructor(
        public emailCtr: EmailComposer,
        public screenshot: Screenshot,
        private alertCtrl: AlertController,
        public storage: Storage,
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

    makeAlert() {
        let alert = this.alertCtrl.create({
            title: 'Nueva funcionalidad',
            subTitle: 'En todas las pantallas informativas existe una opción, en la parte superior derecha, para denunciar datos incorrectos, notificar algún error de la aplicación o sugerir algún cambio.',
            buttons: ['Entiendo']
        });
        alert.present();
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
                let base64RegExp = /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,(.*)/;
                let match = data.URI.match(base64RegExp);

                let email = {
                    to: 'marianoabotta@gmail.com',
                    attachments: [
                        'base64:screenshot.jpg//' + match[2]
                    ],
                    subject: 'ANDES - Error y/o segurencia',
                    body: this.makeInfo(),
                    isHtml: true
                };
                this.emailCtr.open(email);
            })



        }, () => {

        });
    }

}

