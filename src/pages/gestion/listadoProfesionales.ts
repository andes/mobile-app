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
            if (this.dataPage) {
                let query = this.activePage.valor;
                query = query.replace(/{{tipo}}/g, this.dataPage.tipo);
                query = query.replace(/{{cat}}/g, this.dataPage.categoria);
                query = query.replace(/{{key}}/g, this.dataPage.clave);
                query = query.replace(/{{valor}}/g, this.dataPage.id);
                query = query + ' ORDER BY ESPECIALIDAD, APENOM';

                let consulta = await this.datosGestion.executeQuery(query);
                if (consulta && consulta.length) {
                    let director = consulta.filter(p => p.ESPECIALIDAD.includes('DIRECTOR'));
                    let otros = consulta.filter(p => !p.ESPECIALIDAD.includes('DIRECTOR'));
                    this.listado = [...director, ...otros];
                    this.listado = this.listado.map(c => { return { nombreCompleto: c.APENOM, profesion: c.ESPECIALIDAD }; })
                }
                this.listadoTemporal = this.listado;
            }
        }
    }
}
