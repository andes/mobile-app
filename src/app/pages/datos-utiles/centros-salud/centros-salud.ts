import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-centros-salud',
    templateUrl: 'centros-salud.html',
})

export class CentrosSaludPage implements OnInit {
    detectar: boolean;
    titulo: string;
    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params.detectar) {
                this.detectar = JSON.parse(params.detectar);
                this.titulo = 'Puntos "detectar" cercanos';
            } else {
                this.detectar = false;
                this.titulo = 'Centros de Salud cercanos';
            }
        });
    }

    openTab(item) {
        this.router.navigate([`datos-utiles/centros/${item}`], { queryParams: { detectar: this.detectar } });
    }
}

