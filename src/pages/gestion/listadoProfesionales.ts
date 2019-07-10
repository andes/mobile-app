import { IPageGestion } from './../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';

@Component({
    selector: 'listadoProfesionales',
    templateUrl: 'listadoProfesionales.html',
    styles: ['listadoProfesionales.scss']
})

export class ListadoProfesionalesComponent implements OnInit {

    @Input() activePage: IPageGestion;
    @Input() dataPage: any;

    public backPage: IPageGestion;
    public listaItems = [];
    public listado = [];
    public textoLibre;
    public listadoTemporal;
    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider
    ) { }


    ngOnInit() {
        this.cargarValores();
    }


    public buscar($event) {
        this.listadoTemporal = this.listado.filter((item: any) =>
            ((item.usuario) ? (item.usuario.trim().toUpperCase().search(this.textoLibre.toUpperCase()) > -1) : '') ||
            ((item.nombreCompleto) ? (item.nombreCompleto.trim().toUpperCase().search(this.textoLibre.toUpperCase()) > -1) : '') ||
            ((item.profesion) ? (item.profesion.trim().toUpperCase().search(this.textoLibre.toUpperCase()) > -1) : '')
        );

    }
    async cargarValores() {
        if (this.activePage.valor) {
            let query = this.activePage.valor.replace(/{{cat}}/g, this.dataPage.categoria);
            query = query.replace(/{{key}}/g, this.dataPage.clave);
            query = query.replace(/{{valor}}/g, this.dataPage.id);
            let consulta = await this.datosGestion.executeQuery(query);
            if (consulta && consulta.length) {
                for (let i = 0; i < consulta.length; i++) {
                    this.listado.push({ nombreCompleto: consulta[i].APENOM, profesion: consulta[i].ESPECIALIDAD })
                }
            }
            this.listadoTemporal = this.listado;
        }
    }
}
