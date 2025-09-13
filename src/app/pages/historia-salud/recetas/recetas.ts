import { Component, OnInit } from '@angular/core';
import { RecetasProvider } from 'src/providers/historia-salud/recetas';
import { AuthProvider } from 'src/providers/auth/auth';
import { StorageService } from 'src/providers/storage-provider.service';
import { Router } from '@angular/router';
import { ToastProvider } from 'src/providers/toast';
import * as moment from 'moment/moment';

interface Receta {
    nombreMedicamento: string;
    fechaRegistro: string;
    fechaVencimiento: string;
    profesional: string;
    profesionProfesional: string;
    establecimiento: string;
    organizacion: string;
    indicaciones: string;
    cantDias: string;
    notaMedica: string;
}

function formatFecha(fecha) {
    return moment(fecha).format('DD/MM/YY');
}

function mapObjectToReceta(receta): Receta {
    return {
        nombreMedicamento: receta.medicamento.concepto.term,
        fechaRegistro: formatFecha(receta.fechaRegistro),
        fechaVencimiento: formatFecha(moment(receta.fechaRegistro).add(30, 'days')),
        profesional: `${receta.profesional.nombre} ${receta.profesional.apellido}`,
        profesionProfesional: `${receta.profesional.profesion}`,
        establecimiento: receta.organizacion.nombre,
        organizacion: receta.organizacion.nombre,
        indicaciones: receta.medicamento.dosisDiaria?.dosis && receta.medicamento.dosisDiaria?.intervalo
            ? `${receta.medicamento.dosisDiaria.dosis} cada ${receta.medicamento.dosisDiaria.intervalo.nombre}`
            : 'Sin indicaciones',
        cantDias: receta.medicamento.dosisDiaria?.dias
            ? `durante ${receta.medicamento.dosisDiaria?.dias} días`
            : '',
        notaMedica: receta.medicamento.dosisDiaria.notaMedica,
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
        private toastCtrl: ToastProvider
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
                const params = { pacienteId, estado: 'vigente' };
                this.recetasProvider
                    .get(params)
                    .then((recetas: any[]) => {
                        this.recetas = recetas.map((receta) =>
                            mapObjectToReceta(receta)
                        );
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

    verIndicaciones(receta) {
        this.router.navigate(['historia-salud/detalle-receta'], {
            queryParams: { receta: JSON.stringify(receta) },
        });
    }
}
