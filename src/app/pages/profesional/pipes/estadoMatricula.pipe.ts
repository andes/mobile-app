import { Pipe, PipeTransform } from '@angular/core';

/* Dado un elemento de cualquiera de los arrays formacionGrado o formacionPosgrado de un profesional
 * calcula e imprime el estado que corresponda.
*/
@Pipe({
    name: 'estadoMatriculaLabel'
})
export class EstadoMatriculaPipe implements PipeTransform {
    transform(formacion: any): any {
        if (!formacion.matriculacion) {
            return '';
        }
        const estado = calcularEstado(formacion);
        return getLabel(estado);
    }
}

/*  Calcula el estado de la formacion (grado o posgrado) fecha de vencimiento y los flags
    matriculado | renovacion | papelesVerificados | tieneVencimiento | revalida | renovacionOnline.estado
*/
export function calcularEstado(formacion) {
    const hoy = new Date();

    if (formacion.especialidad) {
        // posgrado
        const fechaVencimientoPosgrado = new Date(formacion.matriculacion[formacion.matriculacion.length - 1].periodos[formacion.matriculacion[formacion.matriculacion.length - 1].periodos.length - 1].fin);
        if (formacion.revalida) {
            return getEstadoRenovacion(formacion);
        } else if (!formacion.matriculado) {
            return 'suspendida';
        } else if (!formacion.tieneVencimiento) {
            return 'sinVencimiento';
        } else if (hoy > fechaVencimientoPosgrado) {
            return 'vencida';
        } else {
            return 'vigente';
        }
    } else {
        // grado
        const fechaVencimientoGrado = new Date(formacion.matriculacion[formacion.matriculacion.length - 1].fin);
        if (!formacion.renovacion && formacion.matriculado) {
            return (hoy > fechaVencimientoGrado) ? 'vencida' : 'vigente';
        }
        if (!formacion.renovacion && !formacion.matriculado) {
            return 'suspendida';
        }
        if (formacion.renovacion) {
            return getEstadoRenovacion(formacion);
        }
    }
}

/*  Devuelve el estado del trámite de renovación teniendo en cuenta que el mismo
    pudo haberse iniciado de manera presencial u online
*/
function getEstadoRenovacion(formacion) {
    if (formacion.papelesVerificados) {
        return 'papelesVerificados';
    } else {
        switch (formacion.renovacionOnline?.estado) {
            case 'pendiente':
                return 'enTramite';
            case 'rechazada':
                return 'rechazada';
            default:
                return 'enTramite';
        }
    }
}

// Mapea el estado de la formacion con su label correspondiente
export function getLabel(estado) {
    switch (estado) {
        case 'vigente':
            return 'Vigente';
        case 'vencida':
            return 'Vencida';
        case 'suspendida':
            return 'Suspendida';
        case 'sinVencimiento':
            return 'Sin vencimiento';
        case 'papelesVerificados':
            return 'Papeles verificados';
        case 'rechazada':
            return 'Rechazada';
        case 'enTramite':
            return 'En trámite';
        case 'anioDeGracia':
            return 'Año de gracia';
        default:
            return '';
    }
}
