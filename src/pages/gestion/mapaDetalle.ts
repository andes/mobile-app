import { ToastProvider } from './../../providers/toast';
import { SQLite } from '@ionic-native/sqlite';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { IPageGestion } from '../../interfaces/pagesGestion';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from '../../providers/pageGestion';

import * as moment from 'moment';

@Component({
    selector: 'mapa-detalle',
    templateUrl: 'mapaDetalle.html',
    styles: ['mapa-detalle.scss']
})

export class MapaDetalleComponent implements OnInit {
    @Input() activePage: IPageGestion;

    _ultimaActualizacion;
    @Input()
    get ultimaActualizacion(): Date {
        return this._ultimaActualizacion;
    }
    set ultimaActualizacion(value: Date) {
        this._ultimaActualizacion = value;
        this._ultimaActualizacion = this._ultimaActualizacion ? moment(this.ultimaActualizacion).format('DD/MM/YYYY, hh:mm [hs]') : null;

    }
    public backPage: IPageGestion;
    public mapaSvg;
    public eje;
    public acciones;
    @Input() public periodo;

    @Input() perDesdeMort;

    @Input() perHastaMort;
    constructor(
        public datosGestion: DatosGestionProvider,
        public navCtrl: NavController,
        public pagesGestionProvider: PagesGestionProvider,
        public navParams: NavParams,
        public principal: Principal,
        private sqlite: SQLite,
        private alertCtrl: AlertController,
        private toast: ToastProvider
    ) { }

    ngOnInit() {
        this.mapaSvg = this.activePage.mapa;
        this.acciones = this.activePage.acciones;
    }

    showConfirm(title, message) {
        return new Promise((resolve, reject) => {
            let confirm = this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [
                    {
                        text: 'Cancelar',
                        handler: () => {
                            reject();
                        }
                    },
                    {
                        text: 'Aceptar',
                        handler: () => {
                            resolve();
                        }
                    }
                ]
            });
            confirm.present();
        });

    }

    cleanCache() {
        this.showConfirm('¿Desea borrar los datos almacenados en la aplicación?', '').then(() => {
            const conf = { name: 'data.db', location: 'default' };
            this.sqlite.deleteDatabase(conf);
            this.sqlite.create(conf);
            this.principal.crearTablasSqlite();
            this.toast.success('La caché se limpió exitosamente.');
        }).catch(() => {
            this.toast.danger('VUELVALO A INTENTAR');
        });
    }

    cambiarPagina(datos: any) {
        this.backPage = Object.assign({}, this.activePage);
        if (datos.goto) {
            this.navCtrl.push(Principal, { page: datos.goto, verEstadisticas: this.eje, id: this.activePage.valor.dato });
        }
    }

    verEstadisticas($event) {
        this.eje = $event;
    }

    async actualizar() {
        try {
            await this.principal.actualizarDatos(true);
        } catch (error) {
            return error;
        }

    }
}
