import { Pipe, PipeTransform } from '@angular/core';
import { calcularEstado } from './estadoMatricula.pipe';

// Dado un estado devuelve el type que corresponda.
@Pipe({
    name: 'estadoMatriculaType'
})
export class EstadoMatriculaTypePipe implements PipeTransform {
    transform(formacion: any): any {
        const estado: any = calcularEstado(formacion);
        switch (estado) {
            case 'vigente':
                return 'info';
            case 'vencida':
                return 'danger';
            case 'suspendida':
                return 'warning';
            case 'sinVencimiento':
                return 'warning';
            case 'papelesVerificados':
                return 'success';
            case 'rechazada':
                return 'warning';
            case 'enTramite':
                return 'warning';
            case 'anioDeGracia':
                return 'info';
            default:
                return '';
        }
    }
}
