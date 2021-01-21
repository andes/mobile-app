import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import * as moment from 'moment';


@Injectable()
export class MinutasProvider {
    private templateURL = 'assets/files/minuta.template.html';
    public opts = {
        documentSize: 'A4',
        landscape: 'portrait',
        type: 'share',
        fileName: 'my-pdf.pdf'
    };

    constructor(
        private http: HttpClient) { }


    descargarTemplate(dataMinuta) {
        let filas = '';
        let encabezado = '';
        let problemaNombre = '';
        if (dataMinuta.problemas.length > 0) {
            problemaNombre = `<tr>
            <td colspan="12">
                <hr>
            </td>
        </tr>
        <tr>
            <td style="font-weight: bold;" colspan="4">
                PROBLEMAS:
            <td>
        </tr>`;
            encabezado = `<tr>
            <th style=" border: 1px solid black;">Fecha de registro</th>
            <th style=" border: 1px solid black;">Estado</th>
            <th style=" border: 1px solid black;">Origen</th>
            <th style=" border: 1px solid black;">Problema</th>
            <th style=" border: 1px solid black;">Responsable</th>
            <th style=" border: 1px solid black;">Plazo</th>
            </tr>`;

            for (const problema of dataMinuta.problemas) {

                const fechaRegistro = moment(dataMinuta.problema.fechaRegistro).format('DD/MM/YYYY');
                const plazo = moment(dataMinuta.problema.plazo).format('DD/MM/YYYY');

                filas += `<tr><td style=" border: 1px solid black;">${fechaRegistro}</td>
                         <td style=" border: 1px solid black;">${problema.estado}</td>
                         <td style=" border: 1px solid black;">${problema.origen}</td>
                         <td style=" border: 1px solid black;">${problema.problema}</td>
                         <td style=" border: 1px solid black;">${problema.responsable}</td>
                         <td style=" border: 1px solid black;">${plazo}</td></tr>`;
            }
        }
        return this.http.get(this.templateURL).map((res: any) => {
            const dataHTML = res.text();
            const fechaMinuta = moment(dataMinuta.fecha).format('DD/MM/YYYY');
            const fechaProxima = moment(dataMinuta.fechaProxima).format('DD/MM/YYYY');
            let html = dataHTML
                .replace('<!--FECHA -->', fechaMinuta ? fechaMinuta : 'sin datos');
            html = html
                .replace('<!--ORIGEN -->', dataMinuta.origen ? dataMinuta.origen : 'sin datos');
            html = html
                .replace('<!--REDACTADA -->', dataMinuta.quienRegistra ? dataMinuta.quienRegistra : 'sin datos');
            html = html
                .replace('<!--PARTICIPANTES -->', dataMinuta.participantes ? dataMinuta.participantes : 'sin datos');
            html = html
                .replace('<!--TEMAS -->', dataMinuta.temas ? dataMinuta.temas : 'sin datos');
            html = html
                .replace('<!--CONCLUSIONES -->', dataMinuta.conclusiones ? dataMinuta.conclusiones : 'sin datos');
            html = html
                .replace('<!--FECHAPROXIMA -->', dataMinuta.fechaProxima ? fechaProxima : 'sin datos');
            html = html
                .replace('<!--LUGARPROXIMA -->', dataMinuta.lugarProxima ? dataMinuta.lugarProxima : 'sin datos');
            html = html
                .replace('<!--PROBLEMA-->', problemaNombre);
            html = html
                .replace('<!--ENCABEZADO-->', encabezado);
            html = html
                .replace('<!--PROBLEMAS-->', filas);
            return html;
        });
    }


}
