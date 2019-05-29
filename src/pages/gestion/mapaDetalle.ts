import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IPageGestion } from 'interfaces/pagesGestion';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
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
    constructor(
        public datosGestion: DatosGestionProvider,
        public navCtrl: NavController
    ) { }

    ngOnInit() {
        this.mapaSvg = this.activePage.mapa;
        this.activePageCopy = Object.assign({}, this.activePage);
        this.activePageCopy.acciones.map(async (accion: any) => {
            if (accion && accion.acciones) {
                for (let i = 0; i < accion.acciones.length; i++) {
                    let consulta = await this.datosGestion.talentoHumanoQuery(accion.acciones[i].valor);
                    accion.acciones[i]['consulta'] = consulta[0].talento;


                }
            }
        });
    }



    cambiarPagina(datos: any) {
        this.backPage = Object.assign({}, this.activePage);
        this.navCtrl.push(Principal, { page: datos.goto });
    }

    cargarValores(accion: any) {
        this.valores = true;
        this.ejeActual = accion;

    }
}
