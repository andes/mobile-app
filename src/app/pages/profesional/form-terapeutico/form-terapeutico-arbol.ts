import { Component, OnInit } from '@angular/core';
import { FtpProvider } from 'src/providers/ftp';

@Component({
    selector: 'app-form-terapeutico-arbol',
    templateUrl: 'form-terapeutico-arbol.html',
})

export class FormTerapeuticoArbolPage implements OnInit {
    indices;
    titulo;
    padres: any[];

    constructor(
        private ftp: FtpProvider
    ) { }

    ngOnInit() {
        this.ftp.get({ tree: 1, root: 1 }).then((data: any) => {
            this.indices = data;
            this.titulo = 'Árbol';
        });
    }
}
