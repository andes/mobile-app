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

// Interfaces
import { IPageGestion } from 'interfaces/pagesGestion';

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
        public pagesGestionProvider: PagesGestionProvider,
        public datosGestion: DatosGestionProvider,
        public network: NetworkProvider) {
        this.user = this.authService.user;
        this.actualizando = false;
    }

    async ionViewDidLoad() {
        await this.actualizarDatos();
        this.periodo = await this.datosGestion.maxPeriodo();
        this.numActivePage = this.navParams.get('page') ? this.navParams.get('page') : '1';
        this.dataPage = this.navParams.get('data') ? this.navParams.get('data') : null;
        this.id = this.navParams.get('id') ? this.navParams.get('id') : null;
        this.titulo = this.navParams.get('titulo') ? this.navParams.get('titulo') : '';
        this.origen = this.navParams.get('origen') ? this.navParams.get('origen') : '';
        this.problema = this.navParams.get('registroProblema') ? this.navParams.get('registroProblema') : '';
        console.log('aca llegaron los datos ', this.dataPage)
        this.pagesGestionProvider.get()
            .subscribe(pages => {
                this.pagesList = pages;
                this.activePage = this.pagesList[this.numActivePage];
                console.log('this.active', this.numActivePage)

            });
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
    async actualizarDatos() {
        let estadoDispositivo = this.network.getCurrentNetworkStatus(); // online-offline
        let arr = await this.datosGestion.obtenerDatos();
        let arr1 = await this.datosGestion.obtenerDatosProf();
        // this.datosGestion.limpiar()
        this.datosGestion.createTableRegistroProblemas();
        this.datosGestion.createTableImagenesProblema();
        console.log('arr1', arr1);
        let actualizar = arr.length > 0 ? moment(arr[0].updated) < moment().startOf('day') : true;
        let actualizarProf = arr1.length > 0 ? moment(arr1[0].updated) < moment().startOf('day') : true;
        this.ultimaActualizacion = arr.length > 0 ? arr[0].updated : null;
        this.ultimaActualizacionProf = arr1.length > 0 ? arr1[0].updated : null;
        if (estadoDispositivo === 'online' && actualizar) {
            // if (estadoDispositivo === 'online') {
            this.actualizando = true;
            if (arr.length > 0 || arr1.length > 0) {
                await this.limpiarDatos();
            }

            try {
                let params: any = {};
                if (this.authService.user != null) {
                    params.usuario = {
                        email: this.authService.user.email,
                        password: this.authService.user.password
                    }
                }
                await this.datosGestion.migrarDatos(params);
                this.ultimaActualizacion = new Date();
                this.ultimaActualizacionProf = new Date();
            } catch (error) {
                return (error);
            }
            this.actualizando = false;
        }
    }
}
