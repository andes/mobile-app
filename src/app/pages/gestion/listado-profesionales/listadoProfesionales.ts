import { Component, Input, OnInit } from '@angular/core';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { IPageGestion } from 'src/interfaces/pagesGestion';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'listado-profesionales',
    templateUrl: 'listadoProfesionales.html',
    styleUrls: ['listadoProfesionales.scss']
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
        private datosGestion: DatosGestionProvider
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
                query = query + ' ORDER BY APENOM';
                const consulta = await this.datosGestion.executeQuery(query);
                if (consulta && consulta.length) {
                    const director = consulta.filter(p => p.ESPECIALIDAD.includes('DIRECTOR'));
                    const otros = consulta.filter(p => !p.ESPECIALIDAD.includes('DIRECTOR'));
                    this.listado = [...director, ...otros];
                    this.listado = this.listado.map(c => ({ nombreCompleto: c.APENOM, profesion: c.ESPECIALIDAD }));
                }
                this.listadoTemporal = this.listado;
            }
        }
    }
}
