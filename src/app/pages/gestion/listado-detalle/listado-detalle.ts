import { IPageGestion } from '../../../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
// import { Principal } from './principal';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from 'src/providers/pageGestion';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-listado-detalle',
    templateUrl: 'listado-detalle.html',
    styles: ['mapa-detalle.scss']
})

export class ListadoDetalleComponent implements OnInit {

    @Input() activePage: IPageGestion;
    @Input() dataPage: any;
    public acciones: any;
    public eje;
    public listaItems = [];
    @Input() public periodo;
    @Input() perDesdeMort;

    @Input() perHastaMort;
    public user;

    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider,
        public pagesGestionProvider: PagesGestionProvider,
        public authProvider: AuthProvider,
        public router: Router
    ) {

        this.user = this.authProvider.user;
    }


    ngOnInit() {
        this.cargarDatos();
        this.acciones = this.activePage.acciones;


    }

    async cargarDatos() {
        let consulta;
        switch (this.activePage.template) {
            case 'Efector': consulta = await this.datosGestion.efectoresPorZona(this.dataPage.id);
                break;
        }

        if (consulta.length) {
            if (this.authProvider.esDirector >= 0) {
                let temporal = consulta.filter(x => (Number(x.idEfector) === this.user.idEfector || Number(x.IdEfectorSuperior) === this.user.idEfector))
                consulta = temporal;
            }
            this.listaItems = consulta;
        } else {
            this.listaItems = [];
        }
    }



    cambiarPagina(datos: any, item) {
        const data = {
            id: item.idEfector,
            esHosp: item.ES_Hosp,
            descripcion: item.Efector
        };
        this.router.navigate(['gestion'], {queryParams: { page: datos.goto, data, verEstadisticas: this.eje }});
        // this.navCtrl.push(Principal, { page: datos.goto, data, verEstadisticas: this.eje });
    }



    verEstadisticas($event) {
        this.eje = $event;
    }
}