import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class MinutasProvider {

    private _templateURL = 'assets/files/minuta.template.html';
    public opts = {
        documentSize: 'A4',
        landscape: 'portrait',
        type: 'share',
        fileName: 'my-pdf.pdf'
    }

    constructor(public http: Http) { }


    descargarTemplate(dataMinuta) {
        return this.http.get(this._templateURL).map(res => {
            let dataHTML = res.text();
            let html = dataHTML
                .replace('<!--REDACTADA -->', dataMinuta.to)
            html = html
                .replace('<!--FECHA -->', dataMinuta.from)
            html = html
                .replace('<!--PARTICIPANTES -->', dataMinuta.text)
            return html;
        })
    }


}
