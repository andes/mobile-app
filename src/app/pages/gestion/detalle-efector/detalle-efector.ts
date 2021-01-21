import { IPageGestion } from '../../../../interfaces/pagesGestion';
import { Component, Input, OnInit } from '@angular/core';

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
    ) { }


    ngOnInit() {
        this.acciones = this.activePage.acciones;
    }

    verEstadisticas($event) {
        this.eje = $event;
    }

}
