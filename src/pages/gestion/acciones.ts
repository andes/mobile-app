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
    public enfMed;
    public conGuardia;
    public Med5años;
    public Guardia5años;
    public Egreso5años;
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
        if (this.dataPage && this.dataPage.esHosp === 0) {
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Servicios' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Inversión' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Población' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Automotores' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Mortalidad' });
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
    cargarValores(accion: any) {
        let totalMedicos = 0;
        let totalEnfermeros = 0;
        let totalGuardia = 0;
        let totalAmbulatorio = 0;
        let totalConMed5años = 0;
        let totalConGuardia5años = 0;
        let totalEgre5años = 0;
        if (accion.titulo !== 'Monitoreo') {
            if (accion.goto === 'listadoProfesionales') {
                // El listado de profesionales solo se muestra en las areas y en los efectores
                if (this.activePage.template === 'Efector' || this.activePage.template === 'EfectorDetalle') {
                    let data = {
                        tipo: accion.tipo,
                        categoria: accion.cat ? accion.cat : '',
                        descripcion: accion.titulo,
                        clave: this.activePage ? this.activePage.valor ? this.activePage.valor.key : null : null,
                        id: this.dataPage ? this.dataPage.id : null,
                    };
                    this.navCtrl.push(Principal, { page: accion.goto, data });
                }

            } else {
                this.ejeActual = accion;
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
                this.eje.emit(accion.titulo);
                this.pagesGestionProvider.get()
                    .subscribe(async pages => {
                        this.datos = pages[accion.goto];
                        if (this.datos) {
                            if (this.activePage.template === 'provincia' || this.activePage.template === 'zona') {
                                this.datos = this.datos.filter(dato => { return dato.titulo !== 'Complejidad' });
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
                                this.datos = this.datos.filter(dato => { return dato.titulo !== 'TMAE área programa' });
                                this.datos = this.datos.filter(dato => { return dato.titulo !== 'TMAE mujeres área programa' });
                                this.datos = this.datos.filter(dato => { return dato.titulo !== 'TMAE varones área programa' });
                                this.datos = this.datos.filter(dato => { return dato.titulo !== 'TMI área programa' });
                            }

                            for (let i = 0; i < this.datos.length; i++) {
                                if (accion.titulo === 'T.Humano') {
                                    totalMedicos = this.datos[1].consulta ? this.datos[1].consulta : 0;
                                    totalEnfermeros = this.datos[2].consulta ? this.datos[2].consulta : 0;
                                }
                                if (accion.titulo === 'Produccion') {
                                    totalAmbulatorio = this.datos[0].consulta ? this.datos[0].consulta : 0;
                                    totalGuardia = this.datos[1].consulta ? this.datos[1].consulta : 0;
                                }
                                if (this.datos[i].valor && this.valor && this.valor.key) {
                                    let query = this.datos[i].valor;
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
                                    let consulta = await this.datosGestion.executeQuery(query);
                                    if (consulta && consulta.length) {
                                        this.datos[i]['consulta'] = consulta[0].cantidad;
                                        if (this.datos[i].titulo === 'Personal' || this.datos[i].titulo === 'Bienes de Uso' ||
                                            this.datos[i].titulo === 'Bienes de Consumo' || this.datos[i].titulo === 'Servicios no personal') {
                                            this.datos[i]['consulta'] = (consulta[0].cantidad / 1000000).toFixed(2).toString().replace('.', ',');
                                        }
                                        if (this.ejeActual.titulo === 'Mortalidad' || this.ejeActual.titulo === 'TMAE'
                                            || this.ejeActual.titulo === 'TMAE mujeres' || this.ejeActual.titulo === 'TMAE varones' || this.ejeActual.titulo === 'TMI') {
                                            this.datos[i]['consulta'] = (consulta[0].cantidad).toFixed(2).toString().replace('.', ',');
                                        }
                                        if (this.datos[i].titulo === 'Habitantes por médico') {
                                            this.datos[i]['totalPoblacion'] = consulta[0].cantidad;
                                            if (this.datos[i].totalPoblacion !== 0) {
                                                this.habMed = Math.round(this.datos[i].totalPoblacion / totalMedicos);
                                                this.datos[i]['consulta'] = this.habMed;
                                            } else {
                                                this.datos[i]['consulta'] = 0;
                                            }
                                        }
                                    } else {
                                        this.datos[i]['consulta'] = 0;
                                    }
                                }
                                if (this.datos[i].titulo === 'Razón Enfermero-Médico') {
                                    if (totalMedicos !== 0) {
                                        this.enfMed = (totalEnfermeros / totalMedicos).toFixed(1).toString().replace('.', ',');
                                        this.datos[i]['consulta'] = this.enfMed;
                                    } else {
                                        this.datos[i]['consulta'] = 0;
                                    }
                                }

                                if (this.datos[i].titulo === 'Porcentaje consultas de guardia') {
                                    if (totalGuardia !== 0 || totalAmbulatorio !== 0) {
                                        this.conGuardia = Math.round(totalGuardia / (totalGuardia + totalAmbulatorio) * 100);
                                        this.datos[i]['consulta'] = this.conGuardia;
                                    } else {
                                        this.datos[i]['consulta'] = 0;
                                    }
                                }
                                if (this.datos[i].tituloCorto === 'ConMed5años') {
                                    totalConMed5años = this.datos[i].consulta ? this.datos[i].consulta : 0;
                                    if (totalConMed5años !== 0) {
                                        this.Med5años = Math.round(totalConMed5años / 60);
                                        this.datos[i]['consulta'] = this.Med5años;
                                    } else {
                                        this.datos[i]['consulta'] = 0;
                                    }

                                } if (this.datos[i].tituloCorto === 'ConGuardia5años') {
                                    totalConGuardia5años = this.datos[i].consulta ? this.datos[i].consulta : 0;
                                    if (totalConGuardia5años !== 0) {
                                        this.Guardia5años = Math.round(totalConGuardia5años / 60);
                                        this.datos[i]['consulta'] = this.Guardia5años;
                                    } else {
                                        this.datos[i]['consulta'] = 0;
                                    }
                                } if (this.datos[i].tituloCorto === 'Egre5años') {
                                    totalEgre5años = this.datos[i].consulta ? this.datos[i].consulta : 0;
                                    if (totalEgre5años !== 0) {
                                        this.Egreso5años = Math.round(totalEgre5años / 60);
                                        this.datos[i]['consulta'] = this.Egreso5años;
                                    } else {
                                        this.datos[i]['consulta'] = 0;
                                    }
                                }



                            }
                        }
                    });
            }
        } else {
            this.backPage = Object.assign({}, this.activePage);
            if (this.activePage) {
                this.presentPopover()
                // this.navCtrl.push(Principal, { page: 'registroProblema', titulo: tit ? tit : this.activePage.titulo, data: this.dataPage });
            }
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
        } else if (action === 'nuevoReporte') {
            let tit = 'registroProblema';
            this.navCtrl.push(Principal, { page: 'registroProblema', titulo: tit ? tit : this.activePage.titulo, origen: this.activePage, data: this.dataPage });
        } else if (action === 'monitoreo') {
            let tit = this.dataPage ? (this.dataPage.descripcion ? this.dataPage.descripcion : null) : null;
            this.navCtrl.push(Principal, { page: 'Monitoreo', titulo: tit ? tit : this.activePage.titulo, data: this.dataPage });

        } else if (action === 'listado') {
            let tit = 'listado';
            this.navCtrl.push(Principal, { page: 'listado', titulo: tit ? tit : this.activePage.titulo, data: this.dataPage });

        }

    }

    async  presentPopover(ev?: any) {
        const self = this;

        let data = {
            callback: function (action) {
                self.onMenuItemClick(action);
            },

        }
        let popover = this.popoverController.create(PopOver, data);
        popover.present({
        });
    }
}
