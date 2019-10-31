import { OrganizacionesPage } from './../../../login/organizaciones/organizaciones';
import { IPageGestion } from '../../../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, Slides, ViewController } from 'ionic-angular';
import { DatosGestionProvider } from '../../../../providers/datos-gestion/datos-gestion.provider';
import { VisualizarMinutaComponent } from './visualizarMinuta';
import { MinutasProvider } from '../../../../providers/minutas.provider';

import { RegistroProblema } from './../../registroProblema';
import { AuthProvider } from '../../../../providers/auth/auth';
import { NetworkProvider } from '../../../../providers/network';
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
    listadoMinutasLeidas;
    user;
    pdfObj = null;
    listadoOrdenado = [];
    copyListado;
    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider,
        public minutasProvider: MinutasProvider,
        public authProvider: AuthProvider,
        private viewController: ViewController,
        public network: NetworkProvider
    ) {
        this.viewController.willEnter.subscribe(
            async() =>{ await this.traeDatos();
                this.ordernarListado(this.listadoTemporal)}
		);
        this.user = this.authProvider.user;
     }


    ngOnInit() {
       // this.traeDatos();
    }


    async traeDatos() {
       //await this.datosGestion.obtenerMinutasLeidasSql();
         this.listado = await this.datosGestion.obtenerMinutas();
        // BORRAR
        let estadoDispositivo = this.network.getCurrentNetworkStatus();

        this.listadoMinutasLeidas;
        this.listadoTemporal = this.listado;
        if(this.origen.titulo !== "Toda la provincia"){
            let filtro = this.dataPage ? (this.dataPage.descripcion) : this.origen.titulo;
            this.listadoTemporal = this.listado.filter(unaMinuta => unaMinuta.origen === filtro);
        }
        if (estadoDispositivo === 'online') {
            this.listadoMinutasLeidas = await this.datosGestion.obtenerMinutasLeidas(this.user.id);

            for (let index = 0; index < this.listadoTemporal.length; index++) {
                const minutaSinMarcar = this.listadoTemporal[index];
                minutaSinMarcar.noLeida = true;
                if(this.listadoMinutasLeidas.length === 0){
                    minutaSinMarcar.noLeida = false;
                }else{
                for (let index = 0; index < this.listadoMinutasLeidas.length; index++) {
                    const minutaLeida = this.listadoMinutasLeidas[index];

                    if(minutaSinMarcar.idMongo === minutaLeida.idMinuta){
                        minutaSinMarcar.noLeida = false;
                    }

                }
            }
            }
        }
           
           
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



    ordernarListado(listado){
        this.listadoOrdenado = [];
        for (let index = 0; index < listado.length; index++) {
            const minuta = listado[index];
            if(minuta.noLeida === true){
                this.listadoOrdenado.push(minuta);
                listado.splice(index,1);
                index--
            }
        }

        let nuevoListado = this.listadoOrdenado.concat(listado);
        this.listadoTemporal = nuevoListado;
    }

  

}
