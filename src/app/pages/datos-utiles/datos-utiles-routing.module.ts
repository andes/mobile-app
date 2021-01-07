import { CampaniaDetallePage } from 'src/app/pages/datos-utiles/campanias/detalle/campania-detalle';
import { PuntoSaludablePage } from './punto-saludable/punto-saludable';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaniasListPage } from './campanias/campanias-list';
import { CentrosSaludPage } from './centros-salud/centros-salud';

import { DatosUtilesPage } from './datos-utiles.page';
import { FarmaciasTurnoPage } from './farmacias-turno/farmacias-turno';
import { FeedNoticiasPage } from './feed-noticias/feed-noticias';
import { NumerosUtilesPage } from './numeros-emergencia/numeros-utiles';
import { FaqPage } from './faq/faq';
import { MapPage } from './centros-salud/map/map';
import { ListPage } from './centros-salud/list/list';
import { CentrosSaludPrestacionesPage } from './centros-salud/centros-salud-prestaciones';

const routes: Routes = [
    {
        path: '',
        component: DatosUtilesPage
    },
    {
        path: 'numeros',
        component: NumerosUtilesPage
    },
    {
        path: 'farmacias',
        component: FarmaciasTurnoPage
    },
    {
        path: 'campanias',
        component: CampaniasListPage
    },
    {
        path: 'campania-detalle',
        component: CampaniaDetallePage
    },
    {
        path: 'noticias',
        component: FeedNoticiasPage
    },
    {
        path: 'punto-saludable',
        component: PuntoSaludablePage
    },
    {
        path: 'faq',
        component: FaqPage
    },
    {
        path: 'centros',
        component: CentrosSaludPage,
        children: [
            {
                path: '',
                component: MapPage
            },
            {
                path: 'mapa',
                component: MapPage
            },
            {
                path: 'lista-cercanos',
                component: ListPage
            }
        ]
    },
    {
        path: 'cs-prestaciones',
        component: CentrosSaludPrestacionesPage
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DatosUtilesPageRoutingModule { }
