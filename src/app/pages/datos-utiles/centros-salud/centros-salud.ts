import { Router, ActivatedRoute } from '@angular/router';
import { Component, AfterViewInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-centros-salud',
    templateUrl: 'centros-salud.html',
})

export class CentrosSaludPage implements AfterViewInit {
    detectar: boolean;
    titulo: string;
    detectar$: Observable<any>;
    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngAfterViewInit(): void {
        this.detectar$ = this.route.queryParams.pipe(
            tap((params) => {
                if (params.detectar && JSON.parse(params.detectar) === true) {
                    this.detectar = true;
                    this.titulo = 'Puntos "detectar" cercanos';
                } else {
                    this.detectar = false;
                    this.titulo = 'Centros de Salud cercanos';
                }
            })
        );
    }

    openTab(item) {
        this.router.navigate([`datos-utiles/centros/${item}`], { queryParams: { detectar: this.detectar } });
    }
}

