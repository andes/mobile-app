import { Router, ActivatedRoute } from '@angular/router';
import { Component, AfterViewInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-centros-salud',
    templateUrl: 'centros-salud.html',
})

export class CentrosSaludPage implements AfterViewInit {
    public tipo;
    titulo: string;
    mapa$: Observable<any>;
    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngAfterViewInit(): void {
        this.mapa$ = this.route.queryParams.pipe(
            tap((params) => {
                if (params.tipo === 'centro-salud') {
                    this.tipo = 'centro-salud';
                    this.titulo = 'Centros de Atención';
                } else if (params.tipo === 'araucania') {
                    this.tipo = 'araucania';
                    this.titulo = 'Centros de atención "Zona Araucanía"';
                }
            })
        );
    }

    openTab(item) {
        this.router.navigate([`datos-utiles/centros/${item}`], { queryParams: { tipo: this.tipo } });
    }
}

