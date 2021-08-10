import { Component, Input, OnInit } from '@angular/core';
import { IPageGestion } from './../../../../interfaces/pagesGestion';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'listado-vehiculos',
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
                const consulta = await this.datosGestion.executeQuery(query);
                if (consulta && consulta.length) {
                    for (const item of consulta) {
                        this.listado.push({ modelo: item.Modelo, anio: item.Anio, patente: item.Patente });
                    }
                }
                this.listadoTemporal = this.listado;
            }
        }
    }
}
