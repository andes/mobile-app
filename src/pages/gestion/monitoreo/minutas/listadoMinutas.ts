import { OrganizacionesPage } from './../../../login/organizaciones/organizaciones';
import { IPageGestion } from '../../../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { DatosGestionProvider } from '../../../../providers/datos-gestion/datos-gestion.provider';
import { VisualizarMinutaComponent } from './visualizarMinuta';
import { MinutasProvider } from '../../../../providers/minutas.provider';

import { RegistroProblema } from './../../registroProblema';
declare var cordova: any;


@Component({
    selector: 'listado-minutas',
    templateUrl: 'listado-minutas.html',
    styles: ['../../../gestion/listadoProblemas.scss']
})

export class ListadoMinutasComponent implements OnInit {
    @Input() titulo: String;
    @Input() activePage: IPageGestion;
    @Input() dataPage: any;
    @Input() id: any;
    @Input() origen;
    public backPage: IPageGestion;
    public listaItems = [];
    public listado = [];
    public textoLibre;
    public listadoTemporal;

    public problemas: any = [];
    letterObj = {
        to: '',
        from: '',
        text: ''

    }
    callback = data => {
        this.problemas.push(data);
    };
    pdfObj = null;
    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider,
        public minutasProvider: MinutasProvider

    ) { }


    ngOnInit() {
        this.traeDatos();
    }



    async traeDatos() {
        this.listado = await this.datosGestion.obtenerMinutas();
        let filtro = this.dataPage ? (this.dataPage.descripcion) : this.origen.titulo;
        this.listadoTemporal = this.listado.filter(unaMinuta => unaMinuta.origen === filtro);
    }

    verMinuta(minuta) {
        this.navCtrl.push(VisualizarMinutaComponent, { minuta: minuta, origen: this.origen, activePage: this.activePage });
    }

    async imprimirMinuta(minuta: any) {
        await this.cargarProblemas(minuta);
        minuta.problemas = this.problemas;
        this.createPdf(minuta);
    }

    createPdf(minuta) {
        this.minutasProvider.descargarTemplate(minuta).subscribe(async dataHtml => {
            cordova.plugins.pdf.fromData(dataHtml
                , this.minutasProvider.opts)
                .then((data) => { })
                .catch((err) => { })
        });

    }
    agregarRegistro(minuta) {
        this.navCtrl.push(RegistroProblema, {
            origen: this.origen, data: this.dataPage, idMinutaSQL: minuta.idMinuta, idMinutaMongo: minuta.idMongo, callback: this.callback
        });
    }

    async cargarProblemas(minuta) {
        let consulta = await this.datosGestion.problemasMinuta(minuta.idMinuta)
        if (consulta.length) {
            this.problemas = consulta;
        } else {
            this.problemas = [];
        }
    }

}
