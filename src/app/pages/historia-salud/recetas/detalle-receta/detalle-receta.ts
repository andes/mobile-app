import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-detalle-receta',
    templateUrl: 'detalle-receta.html',
    styleUrls: ['detalle-receta.scss'],
})
export class DetalleRecetaPage implements OnInit {
    familiar: any = false;
    public receta;
    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.receta = JSON.parse(params.receta);
        });
    }
}
