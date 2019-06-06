import { Component, Input, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    public verEstadisticas;
    constructor(
        public datosGestion: DatosGestionProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
    ) { }

    ngOnInit() {
        this.mapaSvg = this.activePage.mapa;
        this.cargaDatosDinamica();
        console.log(this.navParams)

        this.verEstadisticas = this.navParams.get('verEstadisticas') ? this.navParams.get('verEstadisticas') : null;
        if (this.verEstadisticas) {
            console.log(this.verEstadisticas)
        console.log(this.activePage)
       let filtrado: any = this.activePage.acciones.find(x => this.verEstadisticas.titulo === x.titulo)
            console.log(filtrado)
       this.ejeActual = filtrado
        this.valores = true;
        }

    }
    cargaDatosDinamica() {
        this.activePageCopy = Object.assign({}, this.activePage);
        if (this.activePage.acciones) {
            this.activePageCopy.acciones.map(async (accion: any) => {
                if (accion && accion.acciones) {
                    for (let i = 0; i < accion.acciones.length; i++) {
                        let consulta = await this.datosGestion.talentoHumanoQuery(accion.acciones[i].valor);
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
    cambiarPagina(datos: any) {
        console.log(datos)
        this.backPage = Object.assign({}, this.activePage);
        this.navCtrl.push(Principal, { page: datos.goto, verEstadisticas:  this.ejeActual });
    }

    cargarValores(accion: any) {
        this.valores = true;
        console.log(accion)
        this.ejeActual = accion;
    }
}
