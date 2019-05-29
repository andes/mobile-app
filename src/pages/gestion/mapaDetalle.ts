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
    public datosGestion: DatosGestionProvider
    constructor(
        public navCtrl: NavController
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
        this.ejeActual = accion;
        console.log('valores', this.ejeActual)

    }

    async llamadoConsulta(query) {
        debugger;
        // let consulta = await this.datosGestion.talentoHumanoQuery(query);
        let consulta = await this.datosGestion.talentoHumano('provincia');
        console.log(consulta);
    }
}
