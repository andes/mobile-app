import { Component, Input, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IPageGestion } from '../../interfaces/pagesGestion';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from '../../providers/pageGestion';
import { ListadoProfesionalesComponent } from './listadoProfesionales';
import * as moment from 'moment';

@Component({
    selector: 'mapa-detalle',
    templateUrl: 'mapaDetalle.html',
    styles: ['mapa-detalle.scss']
})

export class MapaDetalleComponent implements OnInit {
    @Input() activePage: IPageGestion;
    @Input() public ultimaActualizacion;

    public backPage: IPageGestion;
    public mapaSvg;
    public eje;
    public acciones;

    constructor(
        public datosGestion: DatosGestionProvider,
        public navCtrl: NavController,
        public pagesGestionProvider: PagesGestionProvider,
        public navParams: NavParams,
    ) { }

    ngOnInit() {
        this.mapaSvg = this.activePage.mapa;
        this.acciones = this.activePage.acciones;
        this.ultimaActualizacion = moment(this.ultimaActualizacion).startOf('hour').fromNow();
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

}
