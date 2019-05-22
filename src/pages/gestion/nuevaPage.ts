// CORE
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

// providders
import { AuthProvider } from '../../providers/auth/auth';
import { PagesGestionProvider } from '../../providers/pageGestion';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
// Interfaces
import { IPageGestion } from 'interfaces/pagesGestion';

// pages


@Component({
    selector: 'nueva-page',
    templateUrl: 'nueva-page.html',
})
export class NuevaPage {
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
        public datosGestion: DatosGestionProvider) {

        this.user = this.authService.user;
        this.loadPages();
    }

    loadPages() {
        this.limpiarDatos();
        this.migrarDatos();
        this.obtenerDatos();
        this.numActivePage = this.navParams.get('page') ? this.navParams.get('page') : '1';
        this.mantenerSesion = this.navParams.get('mantenerSesion') ? this.navParams.get('mantenerSesion') : false;
        this.pagesGestionProvider.get()
            .subscribe(pages => {
                this.pagesList = pages;
                this.activePage = this.pagesList[this.numActivePage];
                this.imagenSegura = this.activePage.mapa ? this.sanitizer.bypassSecurityTrustHtml(this.activePage.mapa.toString()) : null;
            });
    }

    isLogin() {
        return this.authService.user != null;
    }

    volver() {
        this.navCtrl.pop();
    }

    cambiarPagina(page) {
        // guardamos una copia de la pagina en la que estamos actualmente
        this.backPage = Object.assign({}, this.activePage);
        // cambiamos la pagina activa
        this.navCtrl.push(NuevaPage, { page });
    }

    onSelect() {
        console.log('cambia recordar ', this.mantenerSesion)
    }

    obtenerDatos() {
        this.datosGestion.obtenerDatos()
            .then(datos => {
                console.log('datos ', datos);
                this.datos = datos;
            })
            .catch(error => {
                console.error(error);
            });
    }

    limpiarDatos() {
        this.datosGestion.borrarTabla()
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            })
    }

    migrarDatos() {
        // Aca iría loop con los datos traídos de la API
        const data = {
            idEfector: 1,
            rh: 474,
            camas: 85,
            consultas: 6847,
            guardia: 4842,
            egresos: 217
        }
        this.datosGestion.create(data)
            .then(response => {
                this.datos.unshift(data);
            })
            .catch(error => {
                return (error);
            })
    };


}
