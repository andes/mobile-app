import { Component, Input, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { IPageGestion } from '../../interfaces/pagesGestion';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from '../../providers/pageGestion';

import * as moment from 'moment';

@Component({
    selector: 'mapa-detalle',
    templateUrl: 'mapaDetalle.html',
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
        public principal: Principal
    ) { }

    ngOnInit() {
        this.mapaSvg = this.activePage.mapa;
        this.acciones = this.activePage.acciones;
    }



    cambiarPagina(datos: any) {
        this.backPage = Object.assign({}, this.activePage);
        if (datos.goto) {
            this.navCtrl.push(Principal, { page: datos.goto, verEstadisticas: this.eje, id: this.activePage.valor.dato });
        }
    }

    verEstadisticas($event) {
        this.eje = $event;
    }

    async actualizar() {
        try {
            await this.principal.actualizarDatos(true);
        } catch (error) {
            return error;
        }

    }
}
