import { IPageGestion } from './../../../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
// import { Principal } from './principal';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { AuthProvider } from 'src/providers/auth/auth';
import { zip } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-listado',
    templateUrl: 'listado.html',
    styles: ['mapa-detalle.scss']
})

export class ListadoComponent implements OnInit {

    @Input() activePage: IPageGestion;
    @Input() id: any;
    public backPage: IPageGestion;
    public listaItems = [];
    public user;
    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider,
        public authProvider: AuthProvider,
        public router: Router
    ) {
        this.user = this.authProvider.user;
    }


    ngOnInit() {
        // buscar las AREAS por zona... la zona viene en la
        // activePage.valor
        this.cargarDatos();
        // let data = this.activePage;
    }

    async cargarDatos() {
        let consulta = await this.datosGestion.areasPorZona(this.id)
        if (consulta.length) {
            if (this.authProvider.esDirector >= 0) {
                let temporal = consulta.filter(x => Number(x.IdArea) === this.user.idArea)
                consulta = temporal;
            }
            this.listaItems = consulta;
        } else {
            this.listaItems = [];
        }
    }


    cambiarPagina(datos: any, item) {
        const data = {
            id: item.IdArea,
            descripcion: item.Area
        };
        this.router.navigate(['gestion'], {queryParams: { page: datos, data }});
        // this.navCtrl.push(Principal, { page: datos, data });
    }
}
