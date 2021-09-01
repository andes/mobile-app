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
                } else if (params.tipo === 'detectar') {
                    this.tipo = 'detectar';
                    this.titulo = 'Puntos "detectar"';
                } else {
                    this.tipo = 'vacunatorio';
                    this.titulo = 'Centros de Vacunación';
                }
            })
        );
    }

    openTab(item) {
        this.router.navigate([`datos-utiles/centros/${item}`], { queryParams: { tipo: this.tipo } });
    }
}

