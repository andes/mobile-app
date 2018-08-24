import { Injectable } from '@angular/core';

export interface DocumentoEscaneado {
    regEx: RegExp;
    grupoNumeroDocumento: number;
    grupoApellido: number;
    grupoNombre: number;
    grupoSexo: number;
    grupoFechaNacimiento: number;
}

export const DocumentoEscaneados: DocumentoEscaneado[] = [
    // DNI Argentino primera versión
    // Formato: @14157955    @A@1@GUTIERREZ@ROBERTO DANIEL@ARGENTINA@31/05/1960@M@01/11/2011@00079064950@7055 @01/11/2026@421@0@ILR:2.20 C:110927.01 (GM/EXE-MOVE-HM)@UNIDAD #02 || S/N: 0040>2008>>0006
    {
        regEx: /@([MF]*[A-Z0-9]+)\s*@[A-Z]+@[0-9]+@([a-zA-ZñÑáéíóúÁÉÍÓÚÜü'\-\s]+)@([a-zA-ZñÑáéíóúÁÉÍÓÚÜü'\-\s]+)@[A-Z]+@([0-9]{2}\/[0-9]{2}\/[0-9]{4})@([MF])@/i,
        grupoNumeroDocumento: 1,
        grupoApellido: 2,
        grupoNombre: 3,
        grupoSexo: 5,
        grupoFechaNacimiento: 4
    },
    // DNI Argentino segunda y tercera versión
    // Formato: 00327345190@GARCIA@JUAN FRANCISCO@M@23680640@A@25/08/1979@06/01/2015@209
    // Formato: 00125559991@PENA SAN JUAN@ORLANDA YUDITH@F@28765457@A@17/01/1944@28/12/2012
    {
        regEx: /[0-9]+@([a-zA-ZñÑáéíóúÁÉÍÓÚÜü'\-\s]+)@([a-zA-ZñÑáéíóúÁÉÍÓÚÜü'\-\s]+)@([MF])@([MF]*[0-9]+)@[A-Z]@([0-9]{2}\/[0-9]{2}\/[0-9]{4})(.*)/i,
        grupoNumeroDocumento: 4,
        grupoApellido: 1,
        grupoNombre: 2,
        grupoSexo: 3,
        grupoFechaNacimiento: 5
    },

    // QR ACTA DE NACIMIENTO
    // Formato: INOSTROZA, Ramiro Daniel DNI: 54852844Tomo: 5Folio: 88Acta: 507Año: 2015Formato de archivo de imágen no reconocido
    {
        regEx: /([a-zA-ZñÑáéíóúÁÉÍÓÚÜü'\-\s]+),([a-zA-ZñÑáéíóúÁÉÍÓÚÜü'\-\s]+)([DNI: ]{5})([0-9]+)(.*)/i,
        grupoNumeroDocumento: 4,
        grupoApellido: 1,
        grupoNombre: 2,
        grupoSexo: 0,
        grupoFechaNacimiento: 0
    }
];

@Injectable()
export class ScanParser {

    public scan(texto: String) {
        let scanFormat = this.findFormat(texto);
        if (scanFormat) {
            return this.parseDocumentoEscaneado(scanFormat, texto);
        }
        return null;
    }

    /**
     * Busca la RegExp que matchee con el texto escaneado
     */
    private findFormat(textoLibre): any {
        for (let key in DocumentoEscaneados) {
            if (DocumentoEscaneados[key].regEx.test(textoLibre)) {
                return DocumentoEscaneados[key];
            }
        }
        return null;
    }

    /**
     * Extrae los datos del documento escaneado según la regex que macheo anteriormente
     */

    private parseDocumentoEscaneado(documento: any, textoLibre) {

        let datos = textoLibre.match(documento.regEx);
        let sexo = '';
        if (documento.grupoSexo > 0) {
            sexo = (datos[documento.grupoSexo].toUpperCase() === 'F') ? 'Femenino' : 'Masculino';
        }

        return {
            'nombre': datos[documento.grupoNombre],
            'apellido': datos[documento.grupoApellido],
            'documento': datos[documento.grupoNumeroDocumento].replace(/\D/g, ''),
            'fechaNacimiento': datos[documento.grupoFechaNacimiento],
            'sexo': sexo,
            'genero': sexo,
            'telefono': null
        };
    }
}



