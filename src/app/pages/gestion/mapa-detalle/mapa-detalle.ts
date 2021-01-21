import { Component, Input, OnInit } from '@angular/core';
import { IPageGestion } from '../../../../interfaces/pagesGestion';
import { PagesGestionProvider } from 'src/providers/pageGestion';
import { AuthProvider } from 'src/providers/auth/auth';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { GestionPage } from '../gestion.page';

@Component({
    selector: 'app-mapa-detalle',
    templateUrl: 'mapa-detalle.html',
})

export class MapaDetalleComponent implements OnInit {
    @Input() activePage: IPageGestion;

    ultimaActualizacionLocal;
    @Input()
    get ultimaActualizacion(): Date {
        return this.ultimaActualizacionLocal;
    }
    set ultimaActualizacion(value: Date) {
        this.ultimaActualizacionLocal = value;
        this.ultimaActualizacionLocal = this.ultimaActualizacionLocal ?
            moment(this.ultimaActualizacion).format('DD/MM/YYYY, hh:mm [hs]') : null;

    }
    public backPage: IPageGestion;
    public mapaSvg;
    public eje;
    public acciones;
    @Input() public periodo;

    @Input() perDesdeMort;

    @Input() perHastaMort;
    constructor(
        private pagesGestionProvider: PagesGestionProvider,
        private authProvider: AuthProvider,
        private router: Router,
        private gestion: GestionPage
    ) { }

    ngOnInit() {
        this.mapaSvg = this.activePage.mapa;
        this.acciones = this.activePage.acciones;
    }

    cambiarPagina(datos: any) {
        this.backPage = Object.assign({}, this.activePage);
        if (datos.goto) {
            this.pagesGestionProvider.get()
                .subscribe(async pages => {
                    if (this.activePage.template === 'provincia') {
                        const idPagSiguiente = Number(pages[datos.goto].valor.dato);
                        if (this.authProvider.esJefeZona >= 0 || this.authProvider.esDirector >= 0) {
                            if (this.authProvider.user.idZona === idPagSiguiente) {
                                const queryParams = { page: datos.goto, verEstadisticas: this.eje, id: this.activePage.valor.dato };
                                this.router.navigate(['gestion'], { queryParams }).then(() => window.location.reload());
                            }

                        } else {
                            const queryParams = { page: datos.goto, verEstadisticas: this.eje, id: this.activePage.valor.dato };
                            this.router.navigate(['gestion'], { queryParams }).then(() => window.location.reload());

                        }
                    } else {
                        const queryParams = { page: datos.goto, verEstadisticas: this.eje, id: this.activePage.valor.dato };
                        this.router.navigate(['/gestion'], { queryParams });
                        // .then(() => window.location.reload());
                    }

                });

        }
    }

    verEstadisticas($event) {
        this.eje = $event;
    }

    async actualizar() {
        try {
            await this.gestion.actualizarDatos(true);
        } catch (error) {
            return error;
        }

    }
}
