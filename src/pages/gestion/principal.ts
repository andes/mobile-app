// CORE
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

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
    public mantenerSesion = false;
    datos: any[] = [];
    user: any;

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
        this.loadPages();
    }

    async loadPages() {
        let estado = this.network.getCurrentNetworkStatus(); // online-offline

        // DATOS SQLITE
        // Agregar fecha de actualización y si se actualizó en la fecha de hoy agregar en la condición para que no migre
        if (estado === 'online') {
            // let arr: any = [];
            // arr = await this.datosGestion.obtenerDatos();
            // console.log('arr', arr);
            // if (arr.length > 0) {
            //     console.log('entra a eliminar tabla');
            //     await this.datosGestion.delete();
            // }
            // try {
            //     console.log('va a migrar tabla');
            //     await this.datosGestion.migrarDatos();
            // } catch (error) {
            //     console.log('error catcheado', error);
            // }
            // let datosFinales = await this.datosGestion.obtenerDatos();
            // console.log('Datos ', datosFinales);
        }
        // FIN DATOS SQLITE
        this.numActivePage = this.navParams.get('page') ? this.navParams.get('page') : '1';
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
        debugger;
        return this.activePage = this.pagesList[numActivePage];
    }
    cambiarPagina(page) {
        // guardamos una copia de la pagina en la que estamos actualmente
        this.backPage = Object.assign({}, this.activePage);
        // cambiamos la pagina activa
        this.navCtrl.push(Principal, { page });
    }

    onSelect() {
        console.log('cambia recordar ', this.mantenerSesion)
    }

    limpiarDatos() {
        this.datosGestion.delete()
            .then()
            .catch(error => {
                console.error('limpiarDatos error', error);
            })
    }
}
