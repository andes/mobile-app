import { Component, OnInit } from '@angular/core';
import { RecetasProvider } from 'src/providers/historia-salud/recetas';
import { AuthProvider } from 'src/providers/auth/auth';
import { StorageService } from 'src/providers/storage-provider.service';
import { Router } from '@angular/router';
import { ToastProvider } from 'src/providers/toast';
import { ENV } from '@app/env';
import * as moment from 'moment/moment';
import { DescargaArchivosProvider } from 'src/providers/library-services/descarga-archivos';

interface Receta {
    nombreMedicamento: string;
    fechaRegistro: string;
    fechaVencimiento: string;
    profesional: string;
    profesionProfesional: string;
    matriculaProfesional: string;
    idPrestacion: string;
    idRegistro: string;
    establecimiento: string;
    organizacion: string;
    indicaciones: string;
    cantDias: string;
    notaMedica: string;
    estado?: string;
    estadoDispensa?: string;
    tratamientoProlongado?: boolean;
    ordenTratamiento?: number;
    tiempoTratamiento?: string;
    fechaRegistroRaw?: string;
    estadoLabel?: string;
    estadoColor?: string;
}

function formatFecha(fecha) {
    return moment(fecha).format('DD/MM/YY');
}

function mapObjectToReceta(receta): Receta {
    let estadoLabel = '';
    let estadoColor = '';

    const estado = receta.estadoActual?.tipo;
    const estadoDispensa = receta.estadoDispensaActual?.tipo;

    if (estado === 'finalizada') {
        estadoLabel = 'Dispensada';
        estadoColor = 'primary';
    } else if (estadoDispensa === 'dispensa-parcial') {
        estadoLabel = 'Dispensada parcial';
        estadoColor = 'warning';
    } else if (estado === 'vencida') {
        estadoLabel = 'Vencida';
        estadoColor = 'danger';
    } else if (estado === 'vigente') {
        estadoLabel = 'Vigente';
        estadoColor = 'success';
    } else if (estado === 'pendiente') {
        // Para tratamiento prolongado, 'pendiente' es clínicamente vigente
        if (receta.medicamento?.tratamientoProlongado) {
            estadoLabel = 'Vigente';
            estadoColor = 'success';
        } else {
            estadoLabel = 'Pendiente';
            estadoColor = 'warning';
        }
    } else if (estado === 'suspendida') {
        estadoLabel = 'Suspendida';
        estadoColor = 'danger';
    } else {
        estadoLabel = estado || '';
        estadoColor = 'primary';
    }

    return {
        nombreMedicamento: receta.medicamento.concepto.term,
        fechaRegistro: formatFecha(receta.fechaRegistro),
        fechaVencimiento: formatFecha(moment(receta.fechaRegistro).add(30, 'days')),
        profesional: `${receta.profesional.nombre} ${receta.profesional.apellido}`,
        profesionProfesional: `${receta.profesional.profesion}`,
        matriculaProfesional: `${receta.profesional.matricula}`,
        idPrestacion: receta.idPrestacion,
        idRegistro: receta.idRegistro,
        establecimiento: receta.organizacion.nombre,
        organizacion: receta.organizacion.nombre,
        indicaciones: receta.medicamento.dosisDiaria?.dosis && receta.medicamento.dosisDiaria?.intervalo
            ? `${receta.medicamento.dosisDiaria.dosis} cada ${receta.medicamento.dosisDiaria.intervalo.nombre}`
            : 'Sin indicaciones',
        cantDias: receta.medicamento.dosisDiaria?.dias
            ? `durante ${receta.medicamento.dosisDiaria?.dias} días`
            : '',
        notaMedica: receta.medicamento.dosisDiaria.notaMedica,
        estado,
        estadoDispensa,
        tratamientoProlongado: receta.medicamento?.tratamientoProlongado,
        ordenTratamiento: receta.medicamento?.ordenTratamiento,
        tiempoTratamiento: receta.medicamento?.tiempoTratamiento?.nombre,
        fechaRegistroRaw: receta.fechaRegistro,
        estadoLabel,
        estadoColor,
    };
}

@Component({
    selector: 'app-recetas',
    templateUrl: 'recetas.html',
    styleUrls: ['recetas.scss'],
})
export class RecetasPage implements OnInit {
    familiar: any = false;
    inProgress = false;
    public recetas: Receta[] = [];
    constructor(
        private authProvider: AuthProvider,
        private router: Router,
        private recetasProvider: RecetasProvider,
        private storage: StorageService,
        private toastCtrl: ToastProvider,
        private descargaProvider: DescargaArchivosProvider,
    ) { }

    ngOnInit() {
        this.inProgress = true;
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            if (this.authProvider.user) {
                let pacienteId;
                if (this.familiar) {
                    pacienteId = this.familiar.id;
                } else {
                    pacienteId = this.authProvider.user.pacientes[0].id;
                }
                const params = { pacienteId };
                this.recetasProvider
                    .get(params)
                    .then((recetas: any[]) => {
                        const mapped = recetas.map((receta) =>
                            mapObjectToReceta(receta)
                        );
                        this.recetas = this.filterAndProcessRecetas(mapped);
                    })
                    .catch((error) => {
                        if (error) {
                            this.toastCtrl.danger(
                                'Ha ocurrido un error al obtener las categorías.'
                            );
                        }
                    });
                this.inProgress = false;
            }
        });
    }

    filterAndProcessRecetas(recetas: Receta[]): Receta[] {
        const tresMesesAtras = moment().subtract(3, 'months').startOf('day');

        // 1. Filtrar por estados permitidos y regla de los 3 meses
        const eligibleRecetas = recetas.filter(receta => {
            const estado = receta.estado;
            const estadoDispensa = receta.estadoDispensa;

            const isVigente = estado === 'vigente';
            const isDispensada = estado === 'finalizada';
            const isDispensaParcial = estadoDispensa === 'dispensa-parcial';
            const isPendiente = estado === 'pendiente';
            const isVencida = estado === 'vencida';
            const isSuspendida = estado === 'suspendida';

            if (!isVigente && !isDispensada && !isDispensaParcial && !isPendiente && !isVencida && !isSuspendida) {
                return false;
            }

            // Aplicar filtro de 3 meses para vigente, finalizada y dispensada parcial, a menos que sea tratamiento prolongado
            if (isVigente || isDispensada || isDispensaParcial) {
                const fechaReg = moment(receta.fechaRegistroRaw);
                const isReciente = fechaReg.isSameOrAfter(tresMesesAtras);
                const isProlongado = receta.tratamientoProlongado;
                return isReciente || isProlongado;
            }

            // 'pendiente' y 'vencida' se muestran siempre
            return true;
        });

        // 2. Separar las "ya dispensadas" de las otras
        const dispensadas: Receta[] = [];
        const otras: Receta[] = [];
        const prolongadasOtras: Receta[] = [];
        const prolongadasDispensadas: Receta[] = [];

        eligibleRecetas.forEach(receta => {
            const isDispensada = receta.estado === 'finalizada' || receta.estadoDispensa === 'dispensa-parcial';
            if (receta.tratamientoProlongado) {
                if (isDispensada) {
                    prolongadasDispensadas.push(receta);
                } else {
                    prolongadasOtras.push(receta);
                }
            } else {
                if (isDispensada) {
                    dispensadas.push(receta);
                } else {
                    otras.push(receta);
                }
            }
        });

        // 3a. Dispensadas normales: ultima por medicamento
        const dispensadasMap = new Map<string, Receta>();
        dispensadas.forEach(receta => {
            const term = receta.nombreMedicamento.toLowerCase().trim();
            const existing = dispensadasMap.get(term);
            if (!existing || moment(receta.fechaRegistroRaw).isAfter(moment(existing.fechaRegistroRaw))) {
                dispensadasMap.set(term, receta);
            }
        });

        // 3b. Otras normales: ultima por medicamento
        const otrasMap = new Map<string, Receta>();
        otras.forEach(receta => {
            const term = receta.nombreMedicamento.toLowerCase().trim();
            const existing = otrasMap.get(term);
            if (!existing || moment(receta.fechaRegistroRaw).isAfter(moment(existing.fechaRegistroRaw))) {
                otrasMap.set(term, receta);
            }
        });

        // 3c. Tratamiento prolongado no dispensado: una sola card por medicamento (la mas reciente = mayor paso)
        const prolongadasOtrasMap = new Map<string, Receta>();
        prolongadasOtras.forEach(receta => {
            const term = receta.nombreMedicamento.toLowerCase().trim();
            const existing = prolongadasOtrasMap.get(term);
            if (!existing || moment(receta.fechaRegistroRaw).isAfter(moment(existing.fechaRegistroRaw))) {
                prolongadasOtrasMap.set(term, receta);
            }
        });

        // 3d. Tratamiento prolongado dispensado: una sola card por medicamento (la mas reciente)
        const prolongadasDispensadasMap = new Map<string, Receta>();
        prolongadasDispensadas.forEach(receta => {
            const term = receta.nombreMedicamento.toLowerCase().trim();
            const existing = prolongadasDispensadasMap.get(term);
            if (!existing || moment(receta.fechaRegistroRaw).isAfter(moment(existing.fechaRegistroRaw))) {
                prolongadasDispensadasMap.set(term, receta);
            }
        });

        const uniqueDispensadas = Array.from(dispensadasMap.values());
        const uniqueOtras = Array.from(otrasMap.values());
        const uniqueProlongadasOtras = Array.from(prolongadasOtrasMap.values());
        const uniqueProlongadasDispensadas = Array.from(prolongadasDispensadasMap.values());

        // 4. Combinar y ordenar por fecha de registro descendente
        const result = [
            ...uniqueOtras,
            ...uniqueDispensadas,
            ...uniqueProlongadasOtras,
            ...uniqueProlongadasDispensadas
        ];
        result.sort((a, b) => moment(b.fechaRegistroRaw).diff(moment(a.fechaRegistroRaw)));

        return result;
    }

    verIndicaciones(receta) {
        this.router.navigate(['historia-salud/detalle-receta'], {
            queryParams: { receta: JSON.stringify(receta) },
        });
    }

    descargarPdf(receta) {
        const url = ENV.API_URL + 'modules/descargas/pdf';
        const data = {
            idPrestacion: receta.idPrestacion,
            idRegistro: receta.idRegistro
        };

        const nombreArchivo = `receta-${receta.nombreMedicamento}.pdf`;

        this.toastCtrl.success('La descarga empezará en unos segundos..');

        this.descargaProvider.abrirArchivoDesdeRuta(url, data, nombreArchivo);
    }
}
