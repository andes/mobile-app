import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class MinutasProvider {
    private imagenURL = 'assets/img/logo_letras.png'
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
                .replace('<!--FECHA -->', dataMinuta.fecha)
            html = html
                .replace('<!--ORIGEN -->', dataMinuta.origen)
            html = html
                .replace('<!--REDACTADA -->', dataMinuta.quienRegistra)
            html = html
                .replace('<!--PARTICIPANTES -->', dataMinuta.participantes)
            html = html
                .replace('<!--TEMAS -->', dataMinuta.temas)
            html = html
                .replace('<!--CONCLUSIONES -->', dataMinuta.conclusiones)
            html = html
                .replace('<!--PENDIENTES -->', dataMinuta.pendientes)
            html = html
                .replace('<!--FECHAPROXIMA -->', dataMinuta.fechaProxima)
            html = html
                .replace('<!--LUGARPROXIMA -->', dataMinuta.lugarProxima)
            // html = html
            //     .replace('<!--IMAGEN -->', `<img src="data:image/png;base64,${logoPDP.toString('base64')}">`)
            return html;
        })
    }


}
