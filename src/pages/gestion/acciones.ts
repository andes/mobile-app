import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { IPageGestion, IAccionGestion } from 'interfaces/pagesGestion';
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
    @Input() dataPage: any;
    @Output() eje: EventEmitter<String> = new EventEmitter();

    public ejeActual: IPageGestion;
    public datos;
    public verEstadisticas;

    constructor(
        public datosGestion: DatosGestionProvider,
        public pagesGestionProvider: PagesGestionProvider,
        public navParams: NavParams,
    ) { }
    ngOnInit() {
        this.verEstadisticas = this.navParams.get('verEstadisticas') ? this.navParams.get('verEstadisticas') : null;
        if (this.verEstadisticas) {
            let filtrado: any = this.acciones.find(x => this.verEstadisticas === x.titulo);
            if (filtrado) {
                this.ejeActual = filtrado
                console.log('Eje Actual', this.ejeActual);
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
                    for (let i = 0; i < this.datos.length; i++) {
                        if (this.datos[i].valor && this.valor && this.valor.key) {
                            let query = this.datos[i].valor.replace(/{{key}}/g, this.valor.key);
                            query = query.replace(/{{valor}}/g, this.valor.dato);
                            if (this.dataPage && this.dataPage.id) {

                                query = query.replace(/{{DATA}}/g, this.dataPage.id);
                            }
                            if (this.datos[i].where) {
                                query = query.replace(/{{where}}/g, this.datos[i].where);
                            } else {
                                query = query.replace(/{{where}}/g, '');
                            }
                            console.log('consulta ', query);
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

    }

    cerrarEstadisticas() {
        this.ejeActual = null
        this.eje.emit(null);

    }
}
