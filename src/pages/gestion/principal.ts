// CORE
import { Component, OnInit } from '@angular/core';
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
    public mantenerSesion = false;
    datos: any[] = [];
    user: any;
    actualizando: boolean;

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

        this.numActivePage = this.navParams.get('page') ? this.navParams.get('page') : '1';
        this.dataPage = this.navParams.get('data') ? this.navParams.get('data') : null;
        this.mantenerSesion = this.navParams.get('mantenerSesion') ? this.navParams.get('mantenerSesion') : false;
        this.pagesGestionProvider.get()
            .subscribe(pages => {
                this.pagesList = pages;
                this.activePage = this.pagesList[this.numActivePage];
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
    }

    // Migración / Actualización de los datos de gestión a SQLite si el dispositivo está conectado y no fue actualizado en la fecha de hoy
    async actualizarDatos() {

        let estadoDispositivo = this.network.getCurrentNetworkStatus(); // online-offline
        let arr = await this.datosGestion.obtenerDatos();
        let actualizar = arr.length > 0 ? moment(arr[0].updated) < moment().startOf('day') : true;
        if (estadoDispositivo === 'online' && actualizar) {
            // if (estadoDispositivo === 'online') {
            this.actualizando = true;
            if (arr.length > 0) {
                await this.datosGestion.delete();
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
            } catch (error) {
                return (error);
            }
            this.actualizando = false;
        }
    }
}
