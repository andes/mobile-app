import { IPageGestion } from './../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';

@Component({
    selector: 'listado',
    templateUrl: 'listado.html',
    styles: ['mapa-detalle.scss']
})

export class ListadoComponent implements OnInit {

    @Input() activePage: IPageGestion;
    @Input() id: any;
    public backPage: IPageGestion;
    public listaItems = [];

    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider
    ) { }


    ngOnInit() {
        // buscar las AREAS por zona... la zona viene en la
        // activePage.valor
        this.cargarDatos();
        // let data = this.activePage;
    }

    async cargarDatos() {
        let consulta = await this.datosGestion.areasPorZona(this.id)
        if (consulta.length) {
            this.listaItems = consulta;
        } else {
            this.listaItems = [];
        }
    }


    cambiarPagina(datos: any, item) {
        let data = {
            id: item.IdArea,
            descripcion: item.Area
        };
        this.navCtrl.push(Principal, { page: datos, data });
    }
}
