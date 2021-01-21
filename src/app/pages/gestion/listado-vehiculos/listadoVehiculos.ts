import { Component, Input, OnInit } from '@angular/core';
import { IPageGestion } from './../../../../interfaces/pagesGestion';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';

@Component({
    selector: 'listadoVehiculos',
    templateUrl: 'listadoVehiculos.html'
})

export class ListadoVehiculosComponent implements OnInit {

    @Input() activePage: IPageGestion;
    @Input() dataPage: any;

    public backPage: IPageGestion;
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
            ((item.patente) ? (item.patente.trim().toUpperCase().search(this.textoLibre.toUpperCase()) > -1) : '')
        );

    }
    async cargarValores() {
        if (this.activePage.valor) {
            if (this.dataPage) {
                let query = this.activePage.valor;
                query = query.replace(/{{cat}}/g, this.dataPage.categoria);
                if (this.dataPage.clave && this.dataPage.id) {
                    query = query + 'AND ' + this.dataPage.clave + '=' + this.dataPage.id;
                }
                query = query + ' ORDER BY Anio DESC';
                let consulta = await this.datosGestion.executeQuery(query);
                if (consulta && consulta.length) {
                    for (let i = 0; i < consulta.length; i++) {
                        this.listado.push({ modelo: consulta[i].Modelo, anio: consulta[i].Anio, patente: consulta[i].Patente })
                    }
                }
                this.listadoTemporal = this.listado;
            }
        }
    }
}
