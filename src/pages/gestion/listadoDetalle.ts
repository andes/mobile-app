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
    public activePageCopy: IPageGestion;
    public valores = false;
    public ejeActual: IPageGestion;
    public listaItems = [];
    public datos;


    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider,
        public pagesGestionProvider: PagesGestionProvider
    ) { }


    ngOnInit() {
        this.cargarDatos();
        let data = this.activePage;

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


    cargarValores(accion: any) {
        this.valores = true;

        this.pagesGestionProvider.get()
            .subscribe(async pages => {
                this.datos = pages[accion.goto];

                for (let i = 0; i < this.datos.length; i++) {
                    let query = this.datos[i].valor.replace(/{{key}}/g, accion.valor.key);
                    query = query.replace(/{{valor}}/g, accion.valor.dato);
                    query = query.replace(/{{DATA}}/g, this.dataPage.id);
                    let consulta = await this.datosGestion.executeQuery(query);
                    if (consulta && consulta.length) {
                        this.datos[i]['consulta'] = consulta[0].talento;
                    } else {
                        this.datos[i]['consulta'] = 0;
                    }
                    this.ejeActual = accion;
                }

            });

    }


    cambiarPagina(datos: any, item) {
        let data = {
            id: item.IdEfector,
            descripcion: item.Efector
        };
        this.navCtrl.push(Principal, { page: datos.goto, data });
    }
}
