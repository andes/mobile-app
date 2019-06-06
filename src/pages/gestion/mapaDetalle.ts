import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IPageGestion } from 'interfaces/pagesGestion';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from '../../providers/pageGestion';
@Component({
    selector: 'mapa-detalle',
    templateUrl: 'mapaDetalle.html',
    styles: ['mapa-detalle.scss']
})

export class MapaDetalleComponent implements OnInit {
    @Input() activePage: IPageGestion;
    public backPage: IPageGestion;
    public mapaSvg;
    public valores = false;
    public ejeActual: IPageGestion;
    public activePageCopy: IPageGestion;
    public datos;
    public pagesList: IPageGestion;

    constructor(
        public datosGestion: DatosGestionProvider,
        public navCtrl: NavController,
        public pagesGestionProvider: PagesGestionProvider

    ) { }

    ngOnInit() {
        this.mapaSvg = this.activePage.mapa;

    }

    cambiarPagina(datos: any) {
        this.backPage = Object.assign({}, this.activePage);
        this.navCtrl.push(Principal, { page: datos.goto });
    }

    cargarValores(accion: any) {
        this.valores = true;

        this.pagesGestionProvider.get()
            .subscribe(async pages => {
                this.datos = pages[accion.goto];

                for (let i = 0; i < this.datos.length; i++) {

                    let query = this.datos[i].valor.replace(/{{key}}/g, accion.valor.key);
                    query = query.replace(/{{valor}}/g, accion.valor.dato);
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
