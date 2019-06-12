import {
    Pipe,
    PipeTransform
} from '@angular/core';
@Pipe({
    name: 'textFilter'
})
export class TextFilterPipe implements PipeTransform {
    transform(items: any[], value: string): any {
        if (!items || !value || value.length === 0) {
            return items;
        }
        // value = value.trim();
        // PARCHE HASTA CONTAR CON INTERFAZ DE PERMISOS

        return items.filter((item: any) =>

            ((item.usuario) ? (item.usuario.trim().toUpperCase().search(value.toUpperCase()) > -1) : '') ||
            ((item.nombreCompleto) ? (item.nombreCompleto.trim().toUpperCase().search(value.toUpperCase()) > -1) : '') ||
            ((item.profesion) ? (item.profesion.trim().toUpperCase().search(value.toUpperCase()) > -1) : '')
        );
    }
}
