import { IPageGestion } from '../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from '../../providers/pageGestion';

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
    public datos;

    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider,
        public pagesGestionProvider: PagesGestionProvider

    ) { }


    ngOnInit() {
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

}
