import { Component } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { DeviceProvider } from 'src/providers/auth/device';
import { NetworkProvider } from 'src/providers/network';
import { ToastProvider } from 'src/providers/toast';
import { IPageGestion } from '../../../interfaces/pagesGestion';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from 'src/providers/pageGestion';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { EventsService } from 'src/app/providers/events.service';

@Component({
    selector: 'app-gestion',
    templateUrl: './gestion.page.html',
    //   styleUrls: ['./gestion.page.scss'],
})
export class GestionPage {
    public numActivePage = '1';
    public activePage: IPageGestion;
    public backPage: IPageGestion;
    public rootPage: IPageGestion;
    public pagesList: any;
    public dataPage: any;
    public id: any;
    public titulo: string;
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
        private deviceProvider: DeviceProvider,
        private authService: AuthProvider,
        private toastProvider: ToastProvider,
        private pagesGestionProvider: PagesGestionProvider,
        private datosGestion: DatosGestionProvider,
        private network: NetworkProvider,
        private events: EventsService,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ionViewWillEnter() {
        this.init();
    }

    init() {
        this.user = this.authService.user;
        this.actualizando = false;
        this.events.setTipoIngreso('gestion');
        this.route.queryParams.subscribe(async params => {
            await this.recargar(params);
        });
    }

    async recargar(params) {
        this.numActivePage = params.page ? params.page : '1';
        this.dataPage = params.data ? JSON.parse(params.data) : null;
        this.id = params.id ? params.id : null;
        this.titulo = params.titulo ? params.titulo : '';
        this.origen = params.origen ? params.origen : '';
        this.problema = params.registroProblema ? params.registroProblema : '';
        this.pagesGestionProvider.get().subscribe(async pages => {
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
        this.events.checkTipoIngreso('gestion');
    }

    recargarGestion() {
        this.router.navigate(['/gestion']).then(() => window.location.reload());
    }

    isLogin() {
        return this.authService.user != null;
    }

    volver() {
        this.router.navigate(['login/disclaimer']);
    }

    paginaActiva(numActivePage) {
        return this.activePage = this.pagesList[numActivePage];
    }

    cambiarPagina(page) {
        // guardamos una copia de la pagina en la que estamos actualmente
        this.backPage = Object.assign({}, this.activePage);
        // cambiamos la pagina activa
        this.router.navigate(['/gestion'], { queryParams: { page } }).then(() => window.location.reload());
    }

    async limpiarDatos() {
        await this.datosGestion.delete();
        await this.datosGestion.deleteProf();
    }

    // Migración / Actualización de los datos de gestión a SQLite si el dispositivo está conectado y no fue actualizado en la fecha de hoy
    async actualizarDatos(act) {
        try {
            if (act) {
                this.actualizando = true;
            }
            const estadoDispositivo = this.network.getCurrentNetworkStatus(); // online-offline
            await this.crearTablasSqlite();
            const arr = await this.datosGestion.obtenerDatos();
            const arr1 = await this.datosGestion.obtenerDatosProf();
            const arr2 = await this.datosGestion.obtenerDatosMortalidad();
            const arr3 = await this.datosGestion.obtenerDatosAutomotores();
            const actualizar = (arr && arr.length) > 0 ? moment(arr[0].updated) < moment().startOf('day') : true;
            this.ultimaActualizacion = (arr && arr.length) > 0 ? arr[0].updated : null;
            if (estadoDispositivo === 'online') {
                this.authService.actualizarToken().then(token => {
                }).catch((err) => {
                    this.deviceProvider.remove().then(() => true, () => true);
                    this.authService.logout();
                    this.router.navigate(['home']);
                });
                if (actualizar || act) {
                    this.actualizando = true;
                    const params: any = {};
                    if (this.authService.user != null) {
                        params.usuario = {
                            email: this.authService.user.email,
                            password: this.authService.user.password
                        };
                    }
                    const migro = await this.datosGestion.migrarDatos(params);
                    if (migro) {
                        this.ultimaActualizacion = new Date();

                    }
                    this.actualizando = false;
                    this.authService.updateAccount({ lastLogin: new Date() });
                }
            } else {
                this.toastProvider.danger('No hay conexión a internet');
                this.actualizando = false;
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
        await this.datosGestion.createTableComunidades();
        await this.datosGestion.createTableMinuta();
        this.datosGestion.createTableRegistroProblemas();
        this.datosGestion.createTableImagenesProblema();
    }


    get esListado() {
        return this.activePage && (this.activePage.tipo === 'detalleEfector');
    }

}
