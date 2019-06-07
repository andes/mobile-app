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
    public backPage: IPageGestion;
    public listaItems = [];

    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider
    ) { }


    ngOnInit() {
        // buscar las localidades por zona... la zona viene en la
        // activePage.valor
        this.cargarDatos();
        // let data = this.acivePage;
    }

    async cargarDatos() {
        let consulta = await this.datosGestion.localidadesPorZona(this.activePage.valor)
        if (consulta.length) {
            this.listaItems = consulta;
        } else {
            this.listaItems = [];
        }
    }


    cambiarPagina(datos: any, item) {
        let data = {
            id: 2,
            descripcion: 2
        };
        this.navCtrl.push(Principal, { page: datos, data });
    }
}
