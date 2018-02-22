
import { Injectable } from '@angular/core';
import { Screenshot } from '@ionic-native/screenshot';
import { EmailComposer } from '@ionic-native/email-composer';
import { AuthProvider } from './auth/auth';

@Injectable()
export class ErrorReporterProvider {

    constructor(
        public emailCtr: EmailComposer,
        public screenshot: Screenshot,
        public auth: AuthProvider) {

    }

    makeInfo() {
        if (this.auth.user) {

            let texto = '';
            texto += 'Los siguientes son datos para identificar el usuario';
            texto += '===============================<br/>';
            texto += 'Nombre: ' + this.auth.user.nombre + ' ' + this.auth.user.apellido;
            texto += '<br/>';
            texto += 'Documento: ' + this.auth.user.documento
            texto += '<br/>';
            texto += '===============================<br>';
            texto += 'A continuación escriba su mensaje: <br/> ';
            return texto;
        } else {
            return '';
        }
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

