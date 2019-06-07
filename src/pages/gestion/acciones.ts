import { Component, Input, OnInit, Output, EventEmitter, QueryList } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IPageGestion, IAccionGestion } from 'interfaces/pagesGestion';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from '../../providers/pageGestion';
@Component({
    selector: 'acciones',
    templateUrl: 'acciones.html',
    styles: ['mapa-detalle.scss']
})

export class AccionesComponent implements OnInit {
    @Input() activePage: IPageGestion;
    @Input() acciones: IAccionGestion[];
    @Input() valor: any;
    @Output() eje: EventEmitter<String> = new EventEmitter();

    public backPage: IPageGestion;
    public valores = false;
    public ejeActual: IPageGestion;
    public activePageCopy: IPageGestion;
    public datos;
    public pagesList: IPageGestion;
    public verEstadisticas;

    constructor(
        public datosGestion: DatosGestionProvider,
        public navCtrl: NavController,
        public pagesGestionProvider: PagesGestionProvider,
        public navParams: NavParams,
    ) { }
    ngOnInit() {
        this.verEstadisticas = this.navParams.get('verEstadisticas') ? this.navParams.get('verEstadisticas') : null;
        console.log('estadisticas', this.verEstadisticas);
        if (this.verEstadisticas) {
            let filtrado: any = this.acciones.find(x => this.verEstadisticas === x.titulo);
            if (filtrado) {
                this.ejeActual = filtrado
                this.cargarValores(this.ejeActual);
            }

        }
    }
    cargarValores(accion: any) {

        this.ejeActual = accion;
        this.eje.emit(accion.titulo);
        this.pagesGestionProvider.get()
            .subscribe(async pages => {
                this.datos = pages[accion.goto];
                if (this.datos) {
                    console.log('datos!', this.datos);
                    for (let i = 0; i < this.datos.length; i++) {
                        if (this.datos[i].valor && this.valor && this.valor.key) {
                            let query = this.datos[i].valor.replace(/{{key}}/g, this.valor.key);
                            query = query.replace(/{{valor}}/g, this.valor.dato);
                            let consulta = await this.datosGestion.executeQuery(query);
                            if (consulta && consulta.length) {
                                this.datos[i]['consulta'] = consulta[0].talento;
                            } else {
                                this.datos[i]['consulta'] = 0;
                            }
                        }

                    }
                }
            });

    }

    cerrarEstadisticas() {
        this.ejeActual = null
        this.eje.emit(null);

    }
}
