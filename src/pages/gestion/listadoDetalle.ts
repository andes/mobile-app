import { IPageGestion } from './../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from '../../providers/pageGestion';

@Component({
    selector: 'listado-detalle',
    templateUrl: 'listadoDetalle.html',
    styles: ['mapa-detalle.scss']
})

export class ListadoDetalleComponent implements OnInit {

    @Input() activePage: IPageGestion;
    @Input() dataPage: any;
    public acciones: any;
    public eje;
    public listaItems = [];
    @Input() public periodo;
    @Input() perDesdeMort;

    @Input() perHastaMort;


    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider,
        public pagesGestionProvider: PagesGestionProvider
    ) { }


    ngOnInit() {
        this.cargarDatos();
        this.acciones = this.activePage.acciones;


    }

    async cargarDatos() {
        let consulta;
        switch (this.activePage.template) {
            case 'Efector': consulta = await this.datosGestion.efectoresPorZona(this.dataPage.id);
                break;
        }

        if (consulta.length) {
            this.listaItems = consulta;
        } else {
            this.listaItems = [];
        }
    }



    cambiarPagina(datos: any, item) {
        let data = {
            id: item.idEfector,
            esHosp: item.ES_Hosp,
            descripcion: item.Efector
        };
        this.navCtrl.push(Principal, { page: datos.goto, data, verEstadisticas: this.eje });
    }



    verEstadisticas($event) {
        this.eje = $event;
    }
}
