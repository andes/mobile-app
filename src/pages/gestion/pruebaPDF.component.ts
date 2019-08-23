import { MinutasProvider } from './../../providers/minutas.provider';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
declare var cordova: any;

@Component({
    selector: 'pruebaPDF',
    templateUrl: 'pruebaPDF.html'
})
export class PruebaPDFPage {
    letterObj = {
        to: '',
        from: '',
        text: ''
    }

    pdfObj = null;

    constructor(public navCtrl: NavController, public minutasProvider: MinutasProvider) { }

    createPdf() {
        this.minutasProvider.descargarTemplate(this.letterObj).subscribe(async dataHtml => {
            console.log('dataHtml', dataHtml);
            cordova.plugins.pdf.fromData(dataHtml
                , this.minutasProvider.opts)
                .then((data) => { console.log(data) })
                .catch((err) => console.log(err))
        });

    }
}
