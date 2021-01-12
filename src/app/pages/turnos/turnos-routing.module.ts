import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TurnosBuscarPage } from './buscar/turnos-buscar';
import { TurnosCalendarioPage } from './calendario/turnos-calendario';
import { TurnosDetallePage } from './detalles/turno-detalle';
import { HistorialTurnosPage } from './historial/historial-turnos';
import { TurnosPrestacionesPage } from './prestaciones/turnos-prestaciones';
import { TurnosPage } from './turnos.page';
import { MapTurnosPage } from './mapa/mapa';

const routes: Routes = [
    {
        path: '',
        component: TurnosPage,
        pathMatch: 'full'
    },
    {
        path: 'prestaciones',
        component: TurnosPrestacionesPage
    },
    {
        path: 'buscar-turnos',
        component: TurnosBuscarPage
    },
    {
        path: 'calendario',
        component: TurnosCalendarioPage
    },
    {
        path: 'detalle',
        component: TurnosDetallePage
    },
    {
        path: 'historial',
        component: HistorialTurnosPage
    },
    {
        path: 'mapa',
        component: MapTurnosPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TurnosPageRoutingModule { }
