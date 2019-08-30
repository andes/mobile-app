import { IPageGestion } from '../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { Principal } from './principal';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';

@Component({
    selector: 'listadoProblemas',
    templateUrl: 'listadoProblemas.html',
    styles: ['listadoProblemas.scss']
})

export class ListadoProblemasComponent implements OnInit {
    @Input() titulo: String;
    @Input() activePage: IPageGestion;
    @Input() dataPage: any;
    @Input() origen: any;
    @Input() id: any;
    public backPage: IPageGestion;
    public listaItems = [];
    public listado = [];
    public textoLibre;
    public listadoTemporal;
    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider
    ) { }


    ngOnInit() {
        this.traeDatos();
    }


    async traeDatos() {
        this.listado = await this.datosGestion.obtenerListadoProblemas();
        let filtro = this.dataPage ? (this.dataPage.descripcion) : this.origen.titulo;
        this.listadoTemporal = this.listado.filter(unProblema => unProblema.origen === filtro).sort((problemaA, problemaB) => {
            return new Date(problemaA.fechaRegistro).getTime() - new Date(problemaB.fechaRegistro).getTime();
        });

    }

    verProblema(problema) {
        this.navCtrl.push(Principal, { page: 'VisualizarProblema', registroProblema: problema });
    }


}
