import { OrganizacionesPage } from './../../../login/organizaciones/organizaciones';
import { IPageGestion } from '../../../../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { VisualizarMinutaComponent } from './visualizarMinuta';
import { MinutasProvider } from 'src/providers/minutas.provider';
import { Observable, of } from 'rxjs';

// import { RegistroProblema } from './../../registroProblema';
declare var cordova: any;


@Component({
    selector: 'app-listado-minutas',
    templateUrl: 'listado-minutas.html',
    // styleUrls: ['../../../gestion/listadoProblemas.scss']
})

export class ListadoMinutasComponent implements OnInit {
    @Input() titulo: string;
    @Input() activePage: IPageGestion;
    @Input() dataPage: any;
    @Input() id: any;
    @Input() origen;
    public listado$: Observable<any>;
    public backPage: IPageGestion;
    public listaItems = [];
    public listado = [];

    public textoLibre;
    public listadoTemporal;
    public db;
    public problemas: any = [];
    letterObj = {
        to: '',
        from: '',
        text: ''

    };
    pdfObj = null;

    callback = data => {
        this.problemas.push(data);
    }

    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider,
        public minutasProvider: MinutasProvider,
        public infiniteScroll: IonInfiniteScroll
    ) { }


    ngOnInit() {
        this.origen = JSON.parse(this.origen);
        // this.traeDatos();
        this.datosGestion.obtenerMinutas().then(minutas => {
            this.listado$ = of(minutas);
        });
        // this.db = this.datosGestion.getDatabase().subscribe()
        // this.datosGestion.getDatabase().subscribe(async () => {
        //     this.listado =  await this.datosGestion.obtenerMinutas();
        //     this.traeDatos();
        // });
    }

    traeDatos() {

        // this.listado = await this.datosGestion.obtenerMinutas();
        this.datosGestion.obtenerMinutas().then(minutas => {
            this.listado$ = of(minutas);
            let filtro = '';
            switch (this.origen.template) {
                case 'provincia':
                    this.listadoTemporal = this.listado;
                    break;
                case 'zona':
                    filtro = this.origen.valor.dato;
                    this.listadoTemporal =
                        this.listado.filter(unaMinuta => (unaMinuta.IdZona && unaMinuta.IdZona.toString() === filtro.toString()));
                    break;
                case 'Efector':
                    filtro = this.dataPage.id;
                    this.listadoTemporal =
                        this.listado.filter(unaMinuta => (unaMinuta.IdArea && unaMinuta.IdArea.toString() === filtro.toString()));
                    break;
                default:
                    filtro = this.dataPage ? (this.dataPage.descripcion) : this.origen.titulo;
                    this.listadoTemporal = this.listado.filter(unaMinuta => unaMinuta.origen === filtro);
                    break;
            }
        });

    }

    verMinuta(minuta) {
        // this.navCtrl.push(VisualizarMinutaComponent, { minuta: minuta, origen: this.origen, activePage: this.activePage });
    }

    async imprimirMinuta(minuta: any) {
        await this.cargarProblemas(minuta);
        minuta.problemas = this.problemas;
        this.createPdf(minuta);
    }

    createPdf(minuta) {
        this.minutasProvider.descargarTemplate(minuta).subscribe(async dataHtml => {
            cordova.plugins.pdf.fromData(dataHtml, this.minutasProvider.opts)
                .then((data) => { })
                .catch((err) => { });
        });

    }
    agregarRegistro(minuta) {
        // this.navCtrl.push(RegistroProblema, {
        //     origen: this.origen, data: this.dataPage, idMinutaSQL: minuta.idMinuta,
        // idMinutaMongo: minuta.idMongo, callback: this.callback
        // });
    }

    async cargarProblemas(minuta) {
        const consulta = await this.datosGestion.problemasMinuta(minuta.idMinuta);
        if (consulta.length) {
            this.problemas = consulta;
        } else {
            this.problemas = [];
        }
    }
}
