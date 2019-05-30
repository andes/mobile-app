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
        let data = this.activePage;
    }

    async cargarDatos() {
        console.log('this.activePage', this.activePage);
        let consulta = await this.datosGestion.localidadesPorZona(this.activePage.valor)
        if (consulta.length) {
            console.log('consultaaaa', consulta);
            this.listaItems = consulta;
        } else {
            this.listaItems = [];
        }
    }


    cambiarPagina(datos: any, item) {
        let data = {
            id: item.IdLocalidad,
            descripcion: item.Localidad
        };
        this.navCtrl.push(Principal, { page: datos.goto, data });
    }
}
