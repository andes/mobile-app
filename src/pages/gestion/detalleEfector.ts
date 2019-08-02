import { IPageGestion } from '../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from '../../providers/pageGestion';

@Component({
    selector: 'detalle-efector',
    templateUrl: 'detalleEfector.html',

    styles: ['mapa-detalle.scss']
})

export class DetalleEfectorComponent implements OnInit {

    @Input() activePage: IPageGestion;
    @Input() dataPage: any;
    public acciones
    public eje;
    @Input() public periodo;
    @Input() perDesdeMort;

    @Input() perHastaMort;
    constructor(
        public navCtrl: NavController,
        public datosGestion: DatosGestionProvider,
        public pagesGestionProvider: PagesGestionProvider

    ) { }


    ngOnInit() {
        this.acciones = this.activePage.acciones;
    }

    verEstadisticas($event) {
        this.eje = $event;
    }

}
