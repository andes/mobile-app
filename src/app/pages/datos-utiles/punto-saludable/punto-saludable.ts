import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NoticiasProvider } from 'src/providers/noticias';

@Component({
    selector: 'app-punto-saludable',
    templateUrl: 'punto-saludable.html'
})
export class PuntoSaludablePage implements OnInit {
    noticias: any = [];
    loading = true;

    constructor(
        private noticiasProvider: NoticiasProvider) {
    }

    openUrl(noticia) {
        if (noticia.urls.length) {
            window.open(noticia.urls[0]);
        }
    }

    ngOnInit() {
        moment.locale('es');
        this.noticiasProvider.puntoSaludable({}).then((data) => {
            this.noticias = data;
            this.loading = false;
        });
    }

}
