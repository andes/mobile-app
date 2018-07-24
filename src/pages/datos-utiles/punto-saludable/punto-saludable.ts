import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import * as moment from 'moment';
import { NoticiasProvider } from '../../../providers/noticias';

@Component({
    selector: 'page-punto-saludable',
    templateUrl: 'punto-saludable.html'
})
export class PuntoSaludablePage implements OnInit {
    noticias: any = [];
    loading = true;

    constructor(
        public noticiasProvider: NoticiasProvider,
        public navCtrl: NavController,
        public platform: Platform) {

    }

    formatDate(noticia) {
        return moment(noticia.fecha).format('DD [de] MMMM [del] YYYY');
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
