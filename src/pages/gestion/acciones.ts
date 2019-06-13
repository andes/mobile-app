import { MonitoreoComponent } from './monitoreo';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { IPageGestion, IAccionGestion } from 'interfaces/pagesGestion';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from '../../providers/pageGestion';
import { Principal } from './principal';
@Component({
    selector: 'acciones',
    templateUrl: 'acciones.html',
    styles: ['mapa-detalle.scss']
})

export class AccionesComponent implements OnInit {
    @Input() activePage: IPageGestion;
    @Input() acciones: IAccionGestion[];
    @Input() valor: any;
    @Input() dataPage: any;
    @Output() eje: EventEmitter<String> = new EventEmitter();
    public backPage: IPageGestion;
    public ejeActual: IPageGestion;
    public datos;
    public verEstadisticas;
    constructor(
        public datosGestion: DatosGestionProvider,
        public pagesGestionProvider: PagesGestionProvider,
        public navParams: NavParams,
        public navCtrl: NavController,
    ) { }
    ngOnInit() {
        this.verEstadisticas = this.navParams.get('verEstadisticas') ? this.navParams.get('verEstadisticas') : null;
        if (this.verEstadisticas) {
            let filtrado: any = this.acciones.find(x => this.verEstadisticas === x.titulo);
            if (filtrado) {
                this.ejeActual = filtrado
                this.cargarValores(this.ejeActual);
            }

        }
    }
    cargarValores(accion: any) {
        if (accion.titulo !== 'Monitores') {
            this.ejeActual = accion;
            this.eje.emit(accion.titulo);
            this.pagesGestionProvider.get()
                .subscribe(async pages => {
                    this.datos = pages[accion.goto];
                    if (this.datos) {
                        for (let i = 0; i < this.datos.length; i++) {
                            if (this.datos[i].valor && this.valor && this.valor.key) {
                                let query = this.datos[i].valor.replace(/{{key}}/g, this.valor.key);
                                query = query.replace(/{{valor}}/g, this.valor.dato);
                                if (this.dataPage && this.dataPage.id) {
                                    query = query.replace(/{{DATA}}/g, this.dataPage.id);
                                }
                                let consulta = await this.datosGestion.executeQuery(query);
                                if (consulta && consulta.length) {
                                    this.datos[i]['consulta'] = consulta[0].cantidad;
                                } else {
                                    this.datos[i]['consulta'] = 0;
                                }

                            }
                        }
                    }
                });

        } else {
            this.backPage = Object.assign({}, this.activePage);
            if (this.activePage) {
                let tit = this.dataPage ? (this.dataPage.descripcion ? this.dataPage.descripcion : null) : null;
                this.navCtrl.push(Principal, { page: accion, titulo: tit ? tit : this.activePage.titulo, data: this.dataPage });
            }
        }
    }

    cerrarEstadisticas() {
        this.ejeActual = null
        this.eje.emit(null);

    }
}
