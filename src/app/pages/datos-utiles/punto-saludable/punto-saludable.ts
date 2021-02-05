import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NoticiasProvider } from 'src/providers/noticias';
import { IonInfiniteScroll } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-punto-saludable',
    templateUrl: 'punto-saludable.html'
})
export class PuntoSaludablePage implements OnInit {
    noticias: any = [];
    loading = true;
    count = 15;
    maxId;
    public backPage = 'home';

    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    constructor(
        private route: ActivatedRoute,
        private noticiasProvider: NoticiasProvider
    ) {
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
            this.maxId = data[data.length - 1].id;
            this.loading = false;
            if (data.length < this.count) {
                this.infiniteScroll.disabled = true;
            }
        });
    }

    ionViewWillEnter() {
        this.route.queryParams.subscribe(async params => {
            if (params.esGestion === 'si') {
                this.backPage = 'gestion';
            } else {
                this.backPage = 'home';
            }
        });
    }

    loadData(event) {
        setTimeout(() => {
            event.target.complete();
            this.noticiasProvider.puntoSaludable({ count: this.count, max_id: this.maxId }).then((data: any) => {
                this.noticias = this.noticias.concat(data.slice(1));
                this.maxId = data[data.length - 1].id;
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
