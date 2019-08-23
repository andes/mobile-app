// CORE
import { Component, OnInit, Input } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import * as moment from 'moment';

// providders
import { AuthProvider } from '../../providers/auth/auth';
import { PagesGestionProvider } from '../../providers/pageGestion';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { NetworkProvider } from '../../providers/network';
import { ToastProvider } from '../../providers/toast';
// Interfaces
import { IPageGestion } from 'interfaces/pagesGestion';
import { interval } from 'rxjs';
import { setInterval } from 'timers';

// pages


@Component({
    selector: 'principal',
    templateUrl: 'principal.html',
    styles: ['principal.scss']
})
export class Principal {
    public numActivePage = '1';
    public activePage: IPageGestion;
    public backPage: IPageGestion;
    public pagesList: IPageGestion;
    public imagenSegura: SafeHtml;
    public dataPage: any;
    public id: any;
    public titulo: String;
    public periodo;
    public perDesdeMort;
    public perHastaMort;
    public origen;
    datos: any[] = [];
    user: any;
    public problema;
    actualizando: boolean;

    public ultimaActualizacion;

    public ultimaActualizacionProf;
    constructor(
        public sanitizer: DomSanitizer,
        public storage: Storage,
        public navCtrl: NavController,
        public navParams: NavParams,
        public authService: AuthProvider,
        public platform: Platform,
        public toastProvider: ToastProvider,
        public pagesGestionProvider: PagesGestionProvider,
        public datosGestion: DatosGestionProvider,
        public network: NetworkProvider) {
        this.user = this.authService.user;
        this.actualizando = false;
    }


    async ionViewDidLoad() {
        this.numActivePage = this.navParams.get('page') ? this.navParams.get('page') : '1';
        this.dataPage = this.navParams.get('data') ? this.navParams.get('data') : null;
        this.id = this.navParams.get('id') ? this.navParams.get('id') : null;
        this.titulo = this.navParams.get('titulo') ? this.navParams.get('titulo') : '';
        this.origen = this.navParams.get('origen') ? this.navParams.get('origen') : '';
        this.problema = this.navParams.get('registroProblema') ? this.navParams.get('registroProblema') : '';
        this.pagesGestionProvider.get()
            .subscribe(async pages => {
                this.pagesList = pages;
                this.activePage = this.pagesList[this.numActivePage];
                if (this.activePage && this.activePage.template === 'provincia') {
                    try {
                        await this.actualizarDatos(false);
                    } catch (error) {
                        return error;
                    }
                }

            });
        if (!this.periodo) {
            this.periodo = await this.datosGestion.maxPeriodo();
        }
        if (!this.perDesdeMort && !this.perHastaMort) {
            this.perDesdeMort = await this.datosGestion.desdePeriodoMortalidad();
            this.perHastaMort = await this.datosGestion.hastaPeriodoMortalidad();
        }
    }

    isLogin() {
        return this.authService.user != null;
    }

    volver() {
        this.navCtrl.pop();
    }
    paginaActiva(numActivePage) {
        return this.activePage = this.pagesList[numActivePage];
    }
    cambiarPagina(page) {
        // guardamos una copia de la pagina en la que estamos actualmente
        this.backPage = Object.assign({}, this.activePage);
        // cambiamos la pagina activa
        this.navCtrl.push(Principal, { page });
    }

    onSelect() {
    }

    async limpiarDatos() {
        await this.datosGestion.delete();
        await this.datosGestion.deleteProf();
    }

    // Migración / Actualización de los datos de gestión a SQLite si el dispositivo está conectado y no fue actualizado en la fecha de hoy
    async actualizarDatos(act) {
        try {
            let estadoDispositivo = this.network.getCurrentNetworkStatus(); // online-offline
            await this.crearTablasSqlite();
            let arr = await this.datosGestion.obtenerDatos();
            let arr1 = await this.datosGestion.obtenerDatosProf();
            let arr2 = await this.datosGestion.obtenerDatosMortalidad();
            let arr3 = await this.datosGestion.obtenerDatosAutomotores();
            let actualizar = arr.length > 0 ? moment(arr[0].updated) < moment().startOf('day') : true;
            let actualizarProf = arr1.length > 0 ? moment(arr1[0].updated) < moment().startOf('day') : true;
            this.ultimaActualizacion = arr.length > 0 ? arr[0].updated : null;
            this.ultimaActualizacionProf = arr1.length > 0 ? arr1[0].updated : null;
            if (estadoDispositivo === 'online') {
                if (actualizar || actualizarProf || act) {
                    this.actualizando = true;
                    // if (estadoDispositivo === 'online') {
                    let params: any = {};
                    if (this.authService.user != null) {
                        params.usuario = {
                            email: this.authService.user.email,
                            password: this.authService.user.password
                        }
                    }
                    await this.datosGestion.sqlToMongoProblemas();
                    await this.datosGestion.mongoToSqlProblemas();
                    await this.datosGestion.sqlToMongoMinutas();
                    await this.datosGestion.mongoToSqlMinutas();
                    let migro = await this.datosGestion.migrarDatos(params);
                    if (migro) {
                        this.ultimaActualizacion = new Date();
                        this.ultimaActualizacionProf = new Date();

                    }
                    this.actualizando = false;
                }
            } else {
                this.toastProvider.danger('No hay conexión a internet.');
            }
            this.periodo = await this.datosGestion.maxPeriodo();
            this.perDesdeMort = await this.datosGestion.desdePeriodoMortalidad();
            this.perHastaMort = await this.datosGestion.hastaPeriodoMortalidad();
        } catch (error) {
            return (error);
        }
    }

    async crearTablasSqlite() {
        await this.datosGestion.createTable();
        await this.datosGestion.createTableProf();
        await this.datosGestion.createTableMortalidad();
        await this.datosGestion.createTableAutomotores();
        await this.datosGestion.createTableMinuta();
        this.datosGestion.createTableRegistroProblemas();
        this.datosGestion.createTableImagenesProblema();
    }
}
