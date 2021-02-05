import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
    selector: 'app-terapeutico-detalle',
    templateUrl: 'form-terapeutico-detalle.html',
})

export class FormTerapeuticoDetallePage implements OnInit {
    mostrarMenu = false;
    item;
    padres;

    constructor(
        private storage: Storage,
        private router: Router
    ) { }

    ngOnInit() {
        this.storage.get('ftp-detalle').then((medicamento) => {
            this.item = medicamento.item;
            this.padres = medicamento.padres;
        });
    }

    volver() {
        this.router.navigate(['/profesional/formulario-terapeutico/arbol']);
    }

}
