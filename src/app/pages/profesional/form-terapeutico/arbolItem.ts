import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { FtpProvider } from 'src/providers/ftp';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-arbol-item',
    templateUrl: 'arbolItem.html',
})

export class ArbolItemPage {

    @Input() indice: any;
    @Input() deep: number;
    indices;
    titulo;
    padres: any[];
    hijos: any[];

    constructor(
        private ftp: FtpProvider,
        private router: Router,
        private storage: Storage,
    ) { }

    esHoja() {
        return !this.indice.arbol || this.indice.arbol.length === 0;
    }

    buscarHijos() {
        this.ftp.get({ tree: 1, idpadre: this.indice._id }).then((data: any) => {
            this.hijos = data;
        });
    }

    verDetalle() {
        const params = {
            item: this.indice,
            idpadres: this.padres
        };
        this.storage.set('ftp-detalle', params);
        this.router.navigate(['/profesional/formulario-terapeutico/detalle']);
    }

}
