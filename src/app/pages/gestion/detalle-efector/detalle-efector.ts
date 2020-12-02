import { IPageGestion } from '../../../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatosGestionProvider } from 'src/providers/datos-gestion/datos-gestion.provider';
import { PagesGestionProvider } from 'src/providers/pageGestion';

@Component({
    selector: 'app-detalle-efector',
    templateUrl: 'detalle-efector.html'
})

export class DetalleEfectorComponent implements OnInit {

    @Input() activePage: IPageGestion;
    @Input() dataPage: any;
    public acciones;
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
