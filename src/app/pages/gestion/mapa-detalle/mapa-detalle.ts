import { Component, Input, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { IPageGestion } from '../../../../interfaces/pagesGestion';
// import { Principal } from './principal';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from 'src/providers/pageGestion';
// import { ListadoProfesionalesComponent } from './listadoProfesionales';
import { AuthProvider } from 'src/providers/auth/auth';

import * as moment from 'moment';
import { Router } from '@angular/router';
import { GestionPage } from '../gestion.page';

@Component({
    selector: 'app-mapa-detalle',
    templateUrl: 'mapa-detalle.html',
    styles: ['mapa-detalle.scss']
})

export class MapaDetalleComponent implements OnInit {
    @Input() activePage: IPageGestion;

    _ultimaActualizacion;
    @Input()
    get ultimaActualizacion(): Date {
        return this._ultimaActualizacion;
    }
    set ultimaActualizacion(value: Date) {
        this._ultimaActualizacion = value;
        this._ultimaActualizacion = this._ultimaActualizacion ? moment(this.ultimaActualizacion).format('DD/MM/YYYY, hh:mm [hs]') : null;

    }
    public backPage: IPageGestion;
    public mapaSvg;
    public eje;
    public acciones;
    @Input() public periodo;

    @Input() perDesdeMort;

    @Input() perHastaMort;
    constructor(
        public datosGestion: DatosGestionProvider,
        public navCtrl: NavController,
        public pagesGestionProvider: PagesGestionProvider,
        public navParams: NavParams,
        // public principal: Principal,
        public authProvider: AuthProvider,
        public router: Router,
        public gestion: GestionPage
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
                        console.log('provincia');
                        const idPagSiguiente = Number(pages[datos.goto].valor.dato);
                        if (this.authProvider.esJefeZona >= 0 || this.authProvider.esDirector >= 0) {
                            console.log('jefe zona');
                            if (this.authProvider.user.idZona === idPagSiguiente) {
                                this.router.navigate(['gestion'],
                                {queryParams: { page: datos.goto, verEstadisticas: this.eje, id: this.activePage.valor.dato }});
                                // this.navCtrl.push(Principal,
                                // { page: datos.goto, verEstadisticas: this.eje, id: this.activePage.valor.dato });
                            }

                        } else {
                            console.log('no jefe zona');
                            this.router.navigate(['gestion'],
                            {queryParams: { page: datos.goto, verEstadisticas: this.eje, id: this.activePage.valor.dato }});
                            //this.navCtrl.push(Principal, { page: datos.goto, verEstadisticas: this.eje, id: this.activePage.valor.dato });

                        }
                    } else {
                        console.log('No provincia');

                        this.router.navigate(['gestion'],
                            {queryParams: { page: datos.goto, verEstadisticas: this.eje, id: this.activePage.valor.dato }});
                        //this.navCtrl.push(Principal, { page: datos.goto, verEstadisticas: this.eje, id: this.activePage.valor.dato });

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
