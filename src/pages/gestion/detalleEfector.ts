import { IPageGestion } from '../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';

@Component({
    selector: 'detalle-efector',
    templateUrl: 'detalleEfector.html',

    styles: ['mapa-detalle.scss']
})

export class DetalleEfectorComponent implements OnInit {

    @Input() activePage: IPageGestion;
    @Input() dataPage: any;
    public backPage: IPageGestion;
    public listaItems = [];
    public valores = false;
    public ejeActual: IPageGestion;
    public activePageCopy: IPageGestion;
    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider
    ) { }


    ngOnInit() {
        console.log('activePage efectordetalle', this.activePage);

        console.log('dataPage efectordetalle', this.dataPage);
        this.cargaDatosDinamica();
    }

    cargaDatosDinamica() {
        this.activePageCopy = Object.assign({}, this.activePage);
        if (this.activePageCopy.acciones && this.activePageCopy.acciones.length) {
            this.activePageCopy.acciones.map(async (accion: any) => {
                if (accion && accion.acciones) {
                    for (let i = 0; i < accion.acciones.length; i++) {
                        let query = accion.acciones[i].valor.replace(/<<DATA>>/g, this.dataPage.id);
                        console.log('query', query)
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
    cargarValores(accion: any) {
        this.valores = true;
        this.ejeActual = accion;
    }
}
