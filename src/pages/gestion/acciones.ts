import { MonitoreoComponent } from './monitoreo';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NavParams, NavController, PopoverController } from 'ionic-angular';
import { IPageGestion, IAccionGestion } from './../../interfaces/pagesGestion';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from '../../providers/pageGestion';
import { Principal } from './principal';
import * as moment from 'moment';
import { debug } from 'util';
import { PopOver } from './popover';
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

    _periodo;
    @Input()
    get periodo(): Date {
        return this._periodo;
    }
    set periodo(value: Date) {
        this._periodo = value;
    }

    _perDesdeMort;
    @Input()
    get perDesdeMort(): Date {
        return this._perDesdeMort;
    }
    set perDesdeMort(value: Date) {
        this._perDesdeMort = value;
        this._perDesdeMort = moment(this.perDesdeMort).add(1, 'year').format('YYYY');
    }

    _perHastaMort;
    @Input()
    get perHastaMort(): Date {
        return this._perHastaMort;
    }
    set perHastaMort(value: Date) {
        this._perHastaMort = value;
        this._perHastaMort = moment(this.perHastaMort).format('YYYY');
    }

    @Output() eje: EventEmitter<String> = new EventEmitter();
    public backPage: IPageGestion;
    public ejeActual: IPageGestion;
    public datos;
    public tot;
    public enfMed;
    public conGuardia;
    public verEstadisticas;
    public habMed;
    public periodoFormato = '';


    constructor(
        public datosGestion: DatosGestionProvider,
        public pagesGestionProvider: PagesGestionProvider,
        public navParams: NavParams,
        public navCtrl: NavController,
        public popoverController: PopoverController
    ) { }
    ngOnInit() {
        if (this.dataPage && (this.dataPage.id === 205 || this.dataPage.id === 216 || this.dataPage.id === 221)) {
            /*Área Neuquén Capital: A nivel efector: El eje población y mortalidad no se mostraría */
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Población' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Mortalidad' });
        }
        if (this.dataPage && (this.dataPage.id === 901 || this.dataPage.id === 902
            || this.dataPage.id === 903 || this.dataPage.id === 904 || this.dataPage.id === 905
            || this.dataPage.id === 909 || this.dataPage.id === 1000 || this.dataPage.id === 2000
            || this.dataPage.id === 3000 || this.dataPage.id === 4000 || this.dataPage.id === 5000
            || this.dataPage.id === 6000)) {
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Servicios' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Inversión' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Produccion' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Población' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Mortalidad' });
        } else {
            if (this.dataPage && this.dataPage.esHosp === 0) {
                this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Servicios' });
                this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'T.Humano' });
                this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Población' });
                this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Automotores' });
                this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Mortalidad' });
            }
        }

        this.verEstadisticas = this.navParams.get('verEstadisticas') ? this.navParams.get('verEstadisticas') : null;
        if (this.verEstadisticas) {
            let filtrado: any = this.acciones.find(x => this.verEstadisticas === x.titulo);
            if (filtrado) {
                this.ejeActual = filtrado
                this.cargarValores(this.ejeActual);
            }

        }


    }

    cargaValoresProfesionales(accion: any) {
        // El listado de profesionales solo se muestra en las areas y en los efectores
        if (this.activePage.template === 'Efector' || this.activePage.template === 'EfectorDetalle') {
            let dataP = {
                tipo: accion.tipo,
                categoria: accion.cat ? accion.cat : '',
                descripcion: accion.titulo,
                clave: this.activePage ? this.activePage.valor ? this.activePage.valor.key : null : null,
                id: this.dataPage ? this.dataPage.id : null,
            };
            this.navCtrl.push(Principal, { page: accion.goto, data: dataP });
        }
    }

    cargaValoresVehiculos(accion: any) {
        let clave = null;
        let id = null;
        switch (this.activePage.valor.mort) {
            case '_Prov':
                clave = null;
                id = null;
                break;
            case '_Zona':
                clave = this.activePage.valor.key;
                id = this.activePage.valor.dato;
                break;
            default:
                clave = this.activePage.valor.key;
                id = this.dataPage.id;
                break;
        }
        let data = {
            categoria: accion.cat ? accion.cat : '',
            descripcion: accion.titulo,
            clave: clave,
            id: id
        };
        this.navCtrl.push(Principal, { page: accion.goto, data });
    }

    filtroDatos(accion: any) {
        if (this.activePage.template === 'provincia' || this.activePage.template === 'zona') {
            this.datos = this.datos.filter(dato => { return dato.titulo !== 'Complejidad' });
            this.datos = this.datos.filter(dato => { return dato.titulo !== 'Porcentaje de ocupación de camas' });
        } else {
            this.datos = this.datos.filter(dato => { return dato.titulo !== 'Cantidad de Hospitales' });
            this.datos = this.datos.filter(dato => { return dato.titulo !== 'Porcentaje consultas de guardia' });
        }
        if (this.dataPage && (this.dataPage.id === 205 || this.dataPage.id === 216 || this.dataPage.id === 221)) {
            /*Área Neuquén Capital: En el eje servicios no mostrar centros ni puestos. En el eje talento humano no mostrar habitantes por medico */
            this.datos = this.datos.filter(dato => { return dato.titulo !== 'Centros de Salud' });
            this.datos = this.datos.filter(dato => { return dato.titulo !== 'Puestos Sanitarios' });
            this.datos = this.datos.filter(dato => { return dato.titulo !== 'Habitantes por médico' });
        }
        if (this.valor.mort === '_Zona' && accion.template === 'mortalidad') {
            /* Solo muestra la comparativa del nivel actual y superior */
            this.datos = this.datos.filter(dato => { return dato.tituloRes !== 'área programa' });
        }
    }

    armarQuery(accion, i, query) {
        if (query !== '0') {
            if (this.valor.mort === '_Prov' && accion.titulo === 'Mortalidad') {
                query = query.replace(/{{valor}}/g, '(SELECT MAX(Periodo) FROM mortalidad)');
                delete this.datos[i].goto;
            }
            query = query.replace(/{{key}}/g, this.valor.key);
            query = query.replace(/{{valor}}/g, this.valor.dato);
            query = query.replace(/{{mortalidad}}/g, this.valor.mort);
            if (this.dataPage && this.dataPage.id || this.dataPage && this.dataPage.id === 0) {
                query = query.replace(/{{DATA}}/g, this.dataPage.id);
            }
        }
        return query;

    }

    formatoPeriodicidad() {
        switch (this.ejeActual.periodicidad) {
            case 'Mensual':
                this.periodoFormato = moment(this.periodo).add(1, 'M').format('MMMM') + ' ' + moment(this.periodo).format('YYYY');
                break;
            case 'Anual':
                this.periodoFormato = (moment(this.periodo).subtract(1, 'year')).format('YYYY');
                break;
            case 'Decenal':
                this.periodoFormato = this._perDesdeMort + '-' + this._perHastaMort;
                break;
        }

    }

    cargarValores(accion: any) {
        if (accion.titulo !== 'Monitoreo') {
            switch (accion.goto) {
                case 'listadoProfesionales':
                    this.cargaValoresProfesionales(accion)
                    break;
                case 'listadoVehiculos':
                    this.cargaValoresVehiculos(accion)
                    break;
                default:
                    this.ejeActual = accion;
                    this.formatoPeriodicidad()
                    this.eje.emit(accion.titulo);
                    this.pagesGestionProvider.get().subscribe(async pages => {
                        this.datos = pages[accion.goto];
                        if (this.datos) {
                            this.filtroDatos(accion)
                            for (let i = 0; i < this.datos.length; i++) {
                                if (this.datos[i].valor && this.valor && this.valor.key) {
                                    let query = this.datos[i].valor;
                                    query = this.armarQuery(accion, i, query)
                                    let consulta = query !== '0' ? await this.datosGestion.executeQuery(query) : ['0'];
                                    if (consulta && consulta.length) {
                                        if (this.datos[i].titulo === 'Complejidad') {
                                            this.datos[i]['consultaComplejidad'] = consulta[0].cantidad ? consulta[0].cantidad : 0;
                                        } else {
                                            this.datos[i]['consulta'] = consulta[0].cantidad ? consulta[0].cantidad : 0;
                                        }

                                        if (accion.titulo && (accion.titulo === 'Administración' || accion.titulo === 'Recupero Financiero' || accion.titulo === 'PACES')) {
                                            if (consulta[0].cantidad && consulta[0].cantidad > 1000000) {
                                                this.datos[i]['consulta'] = (consulta[0].cantidad / 1000000).toFixed(2);
                                                this.datos[i].titulo = this.datos[i].titulo + ' (millones)'
                                            }

                                        }
                                        if (this.ejeActual.titulo === 'Mortalidad' || this.ejeActual.titulo === 'TMAE'
                                            || this.ejeActual.titulo === 'TMAE mujeres' || this.ejeActual.titulo === 'TMAE varones' || this.ejeActual.titulo === 'TMI') {
                                            this.datos[i]['consulta'] = (consulta[0].cantidad).toFixed(2);
                                        }
                                        this.calculos(i, accion, consulta)
                                    } else {
                                        this.datos[i]['consulta'] = 0;
                                    }
                                }


                            }
                        }
                    });

                    break;
            }
        } else {
            this.backPage = Object.assign({}, this.activePage);
            if (this.activePage) {
                this.presentPopover()
            }
        }
    }

    calculos(i, accion, consulta) {
        let total = 0;
        let totalEnfermeros = 0;
        let totalGuardia = 0;
        let totalAmbulatorio = 0;
        let totalMedicos = 0;
        if (accion.titulo === 'Produccion') {
            totalAmbulatorio = this.datos[0].consulta ? this.datos[0].consulta : 0;
            totalGuardia = this.datos[1].consulta ? this.datos[1].consulta : 0;
        }
        if (accion.titulo === 'Indicadores') {
            totalMedicos = this.datos[0].consulta ? this.datos[0].consulta : 0;
            totalEnfermeros = this.datos[1].consulta ? this.datos[1].consulta : 0;
        }
        switch (this.datos[i].titulo) {
            case 'Otros':
                for (let j = 0; j < i; j++) {
                    this.datos[i]['consulta'] = this.datos[i]['consulta'] - this.datos[j]['consulta'];
                }
                break;
            case 'Razón Enfermero-Médico':
                this.datos[i]['consulta'] = totalMedicos !== 0 ? Math.round(totalEnfermeros / totalMedicos) : 0;
                break;
            case 'Porcentaje consultas de guardia':
                this.datos[i]['consulta'] = (totalGuardia !== 0 || totalAmbulatorio !== 0) ? Math.round(totalGuardia / (totalGuardia + totalAmbulatorio) * 100) : 0;
                break;
            case 'Habitantes por médico':
                this.datos[i]['totalPoblacion'] = consulta[0].cantidad;
                this.datos[i]['consulta'] = (this.datos[i].totalPoblacion !== 0) ? Math.round(this.datos[i].totalPoblacion / totalMedicos) : 0;
                break;
        }
        if (this.datos[i].titulo === 'Promedio de Consultas Médicas en los últimos 5 años' ||
            this.datos[i].titulo === 'Promedio de Consultas Médicas de guardia en los últimos 5 años' ||
            this.datos[i].titulo === 'Promedio de egresos en los últimos 5 años') {
            total = this.datos[i].consulta ? this.datos[i].consulta : 0;
            this.datos[i]['consulta'] = total !== 0 ? Math.round(total / 60) : 0;

        }
    }
    cerrarEstadisticas() {
        this.ejeActual = null
        this.eje.emit(null);

    }

    onMenuItemClick(action) {

        if (action === 'cancelar') {
        } else if (action === 'nuevaMinuta') {
            let tit = 'nuevaMinuta';
            this.navCtrl.push(Principal, { page: 'nuevaMinuta', titulo: tit ? tit : this.activePage.titulo, origen: this.activePage, data: this.dataPage });
        } else if (action === 'listadoMinutas') {
            let tit = 'listadoMinutas';
            this.navCtrl.push(Principal, { page: 'listadoMinutas', titulo: tit ? tit : this.activePage.titulo, origen: this.activePage, data: this.dataPage });
        } else if (action === 'monitoreo') {
            let tit = this.dataPage ? (this.dataPage.descripcion ? this.dataPage.descripcion : null) : null;
            this.navCtrl.push(Principal, { page: 'Monitoreo', titulo: tit ? tit : this.activePage.titulo, data: this.dataPage });

        } else if (action === 'listado') {
            let tit = 'listado';
            this.navCtrl.push(Principal, { page: 'listado', titulo: tit ? tit : this.activePage.titulo, data: this.dataPage, origen: this.activePage });

        }

    }

    async  presentPopover(ev?: any) {
        const self = this;
        let data = {
            callback: function (action) {
                self.onMenuItemClick(action);
            },
            origen: this.activePage.template

        }
        let popover = this.popoverController.create(PopOver, data);
        popover.present({
        });
    }
}
