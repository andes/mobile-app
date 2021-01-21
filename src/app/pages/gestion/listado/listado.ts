import { IPageGestion } from './../../../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
// import { Principal } from './principal';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { AuthProvider } from 'src/providers/auth/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-listado-areas',
    templateUrl: 'listado.html'
})

export class ListadoAreasComponent implements OnInit {
    @Input() activePage: IPageGestion;
    @Input() id: any;
    public backPage: IPageGestion;
    public listaItems = [];
    public user;
    public db;
    constructor(
        private datosGestion: DatosGestionProvider,
        private authProvider: AuthProvider,
        private router: Router
    ) {
    }

    async ngOnInit() {
        this.user = this.authProvider.user;
        // buscar las AREAS por zona... la zona viene en la
        // activePage.valor
        await this.cargarDatos();
    }

    async cargarDatos() {
        this.db = this.datosGestion.getDatabase();
        let consulta = await this.datosGestion.areasPorZona(this.id);
        if (consulta.length) {
            if (this.authProvider.esDirector >= 0) {
                const temporal = consulta.filter(x => Number(x.IdArea) === this.user.idArea);
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
        this.router.navigate(['gestion'], { queryParams: { page: datos, data: JSON.stringify(data) } }).then(() => window.location.reload());
    }

}
