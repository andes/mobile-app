import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { Http, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

// pages

// providers

@Component({
    selector: 'app-feed-noticias',
    templateUrl: 'feed-noticias.html'
})
export class FeedNoticiasPage {
    noticias: any[] = [];
    loading = true;

    constructor(
        public http: Http,
        public navCtrl: NavController,
        public platform: Platform) {
        let url;
        if (this.platform.is('mobileweb')) {
            url = '/feed';
        } else {
            url = 'http://www.saludneuquen.gob.ar/feed/';
        }
        this.http.get(url)
            .map(res => res.text())
            .subscribe(data => {
                this.loading = false;
                if (data) {
                    const parser = new DOMParser();
                    const xmlData = parser.parseFromString(data, 'application/xml');
                    const items = xmlData.querySelectorAll('item');
                    // for (const [index, element] of items) {

                    for (let index = 0; index < items.length; index++) {
                        const element = items[index];
                        const title = element.getElementsByTagName('title')[0].innerHTML;
                        const link = element.getElementsByTagName('link')[0].innerHTML;
                        const date = new Date(element.getElementsByTagName('pubDate')[0].innerHTML);

                        let description = element.getElementsByTagName('description')[0].textContent;
                        const category = element.getElementsByTagName('category')[0].textContent;
                        const content = element.getElementsByTagName('content:encoded')[0].textContent;

                        const div = document.createElement('div');
                        div.innerHTML = content;
                        description = div.textContent || div.innerText || '';
                        const imgs = div.getElementsByTagName('img');
                        let img = null;
                        if (imgs.length > 0) {
                            img = imgs[0].getAttribute('src');
                        }
                        if (category !== 'Concursos') {
                            this.noticias.push({ title, link, date, description, category, img });
                        }
                    }

                } else {

                }

            });
    }

    formatDate(noticia) {
        return moment(noticia.date).format('DD [de] MMMM [del] YYYY');
    }

    openUrl(noticia) {
        window.open(noticia.link);
    }


}
