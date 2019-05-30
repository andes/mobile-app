import { IPageGestion } from './../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';

@Component({
    selector: 'listado-detalle',
    templateUrl: 'listadoDetalle.html',
    styles: ['mapa-detalle.scss']
})

export class ListadoDetalleComponent implements OnInit {

    @Input() activePage: IPageGestion;
    @Input() dataPage: any;
    public activePageCopy: IPageGestion;
    public valores = false;
    public ejeActual: IPageGestion;
    public listaItems = [];

    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider
    ) { }


    ngOnInit() {
        // buscar las localidades por zona... la zona viene en la
        // activePage.valor
        this.cargarDatos();
        this.cargaDatosDinamica();
        let data = this.activePage;
        // this.activePageCopy = Object.assign({}, this.activePage);
    }

    async cargarDatos() {
        let consulta;
        switch (this.activePage.template) {
            case 'Efector': consulta = await this.datosGestion.efectoresPorLocalidad(this.dataPage.id);
                break;
        }

        if (consulta.length) {
            this.listaItems = consulta;
        } else {
            this.listaItems = [];
        }
    }


    cargaDatosDinamica() {
        this.activePageCopy = Object.assign({}, this.activePage);
        if (this.activePageCopy.acciones && this.activePageCopy.acciones.length) {
            this.activePageCopy.acciones.map(async (accion: any) => {
                if (accion && accion.acciones) {
                    for (let i = 0; i < accion.acciones.length; i++) {
                        let query = accion.acciones[i].valor.replace(/<<DATA>>/g, this.dataPage.id);
                        let consulta = await this.datosGestion.talentoHumanoQuery(query);
                        if (consulta && consulta.length) {
                            accion.acciones[i]['consulta'] = consulta[0].talento;
                        } else {
                            accion.acciones[i]['consulta'] = 0;
                        }

                    }
                }
            });
        }
    }


    cambiarPagina(datos: any, item) {
        let data = {
            id: item.IdEfector,
            descripcion: item.Efector
        };
        this.navCtrl.push(Principal, { page: datos.goto, data });
    }

    cargarValores(accion: any) {
        this.valores = true;
        this.ejeActual = accion;
    }
}
