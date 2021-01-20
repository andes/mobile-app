import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NoticiasProvider } from 'src/providers/noticias';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
    selector: 'app-punto-saludable',
    templateUrl: 'punto-saludable.html'
})
export class PuntoSaludablePage implements OnInit {
    noticias: any = [];
    loading = true;
    count = 15;
    max_id;
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

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
        this.noticiasProvider.puntoSaludable({ count: this.count }).then((data: any) => {
            this.noticias = data;
            this.max_id = data[data.length - 1].id;
            this.loading = false;
            if (data.length < this.count) {
                this.infiniteScroll.disabled = true;
            }
        });
    }

    loadData(event) {
        setTimeout(() => {
            event.target.complete();
            this.noticiasProvider.puntoSaludable({ count: this.count, max_id: this.max_id }).then((data: any) => {
                this.noticias = this.noticias.concat(data.slice(1));
                this.max_id = data[data.length - 1].id;
                if (data.length < this.count) {
                    event.target.disabled = true;
                }
            });
        }, 500);
    }

    toggleInfiniteScroll() {
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }

}
