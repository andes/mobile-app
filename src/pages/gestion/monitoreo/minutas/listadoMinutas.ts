import { OrganizacionesPage } from './../../../login/organizaciones/organizaciones';
import { IPageGestion } from '../../../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController, Slides, ViewController } from 'ionic-angular';
import { DatosGestionProvider } from '../../../../providers/datos-gestion/datos-gestion.provider';
import { VisualizarMinutaComponent } from './visualizarMinuta';
import { MinutasProvider } from '../../../../providers/minutas.provider';

import { RegistroProblema } from './../../registroProblema';
import { AuthProvider } from '../../../../providers/auth/auth';
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
        private viewController: ViewController
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

    IonViewWillEnter(){
        console.log("estoy llamado")
        this.traeDatos();
    }

      /* lifecycle events */
  ionViewDidLoad() {   console.log("estoy llamado")}
  ionViewWillEnter() {   console.log("estoy llamado")}
  ionViewDidLeave() {   console.log("estoy llamado")}

    


    async traeDatos() {
         this.listado = await this.datosGestion.obtenerMinutas();
        // BORRAR
        this.listadoMinutasLeidas = await this.datosGestion.obtenerMinutasLeidas(this.user.id);
        console.log("listado",this.listadoMinutasLeidas)   
        this.listadoTemporal = this.listado;
        if(this.origen.titulo !== "Toda la provincia"){
            let filtro = this.dataPage ? (this.dataPage.descripcion) : this.origen.titulo;
            this.listadoTemporal = this.listado.filter(unaMinuta => unaMinuta.origen === filtro);
        }

            for (let index = 0; index < this.listadoTemporal.length; index++) {
                const minutaSinMarcar = this.listadoTemporal[index];
                minutaSinMarcar.noLeida = true;
                if(this.listadoMinutasLeidas.length === 0){
                    minutaSinMarcar.noLeida = true;
                }else{
                for (let index = 0; index < this.listadoMinutasLeidas.length; index++) {
                    const minutaLeida = this.listadoMinutasLeidas[index];

                    if(minutaSinMarcar.idMongo === minutaLeida.idMinuta){
                        minutaSinMarcar.noLeida = false;
                    }

                }
            }
            }
            console.log("aca el listado",this.listadoTemporal)
           
           
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
        this.copyListado =  Object.assign([], listado);
        for (let index = 0; index < listado.length; index++) {
            const minuta = listado[index];
            if(minuta.noLeida === true){
                this.listadoOrdenado.push(minuta);
                this.copyListado.splice(index,1);
            }
        }
        console.log("listado sin anexae",this.listadoOrdenado)
        console.log("como quedo listado temp",this.copyListado)
        let nuevoListado = this.listadoOrdenado.concat(this.copyListado);
        this.listadoTemporal = nuevoListado;
        console.log("aca esta el listado",nuevoListado)
    }

  

}
