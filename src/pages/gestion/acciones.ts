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
    @Input() periodo;
    @Output() eje: EventEmitter<String> = new EventEmitter();
    public backPage: IPageGestion;
    public ejeActual: IPageGestion;
    public datos;
    public enfMed;
    public enfHab;
    public conGuardia;
    // public periodo;
    public verEstadisticas;

    public periodoFormato;
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
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Monitoreo' });
        }
        if (this.dataPage && this.dataPage.id === 0) {
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Servicios' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Inversión' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Población' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Automotores' });
            this.acciones = this.acciones.filter(dato => { return dato.titulo !== 'Monitoreo' });
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
        let poblacion = 0;
        let totalMedicos = 0;
        let totalEnfermeros = 0;
        let totalGuardia = 0;
        let totalAmbulatorio = 0;
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
                this.periodoFormato = this.ejeActual.periodicidad === 'Mensual' ? moment(this.periodo).add(1, 'M').format('MMMM') + ' ' + moment(this.periodo).format('YYYY') : (moment(this.periodo).subtract(1, 'year')).format('YYYY');
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
                                /*Área Neuquén Capital: En el eje servicios no mostrar centros ni puestos */
                                this.datos = this.datos.filter(dato => { return dato.titulo !== 'Centros de Salud' });
                                this.datos = this.datos.filter(dato => { return dato.titulo !== 'Puestos Sanitarios' });
                            }

                            for (let i = 0; i < this.datos.length; i++) {
                                if (accion.titulo === 'T.Humano') {
                                    poblacion = this.datos[0].consulta ? this.datos[0].consulta : 0;
                                    totalMedicos = this.datos[1].consulta ? this.datos[1].consulta : 0;
                                    totalEnfermeros = this.datos[2].consulta ? this.datos[2].consulta : 0;
                                }
                                if (accion.titulo === 'Produccion') {
                                    totalAmbulatorio = this.datos[0].consulta ? this.datos[0].consulta : 0;
                                    totalGuardia = this.datos[1].consulta ? this.datos[1].consulta : 0;
                                }
                                if (this.datos[i].valor && this.valor && this.valor.key) {
                                    let query = this.datos[i].valor.replace(/{{key}}/g, this.valor.key);
                                    query = query.replace(/{{valor}}/g, this.valor.dato);
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


                                    } else {
                                        this.datos[i]['consulta'] = 0;
                                    }
                                }
                                if (this.datos[i].titulo === 'Razón Enfermero-Médico') {
                                    if (totalMedicos !== 0) {
                                        this.enfMed = Math.round(totalEnfermeros / totalMedicos);
                                        this.datos[i]['consulta'] = this.enfMed;
                                    } else {
                                        this.datos[i]['consulta'] = 0;
                                    }
                                }
                                if (this.datos[i].titulo === 'Médicos c/1000 habitantes') {
                                    if (poblacion !== 0) {

                                        this.enfHab = Math.round(totalMedicos / poblacion * 1000);
                                        this.datos[i]['consulta'] = this.enfHab;
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
        // const popover = this.popoverController.create({
        //     component: PopOver,
        //     event: null,
        //     translucent: true
        // });
        // await popover.present();
    }
}
