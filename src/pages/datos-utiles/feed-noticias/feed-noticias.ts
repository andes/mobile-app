import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import * as moment from 'moment';
import { Http } from '@angular/http';

// pages

// providers

@Component({
    selector: 'page-feed-noticias',
    templateUrl: 'feed-noticias.html'
})
export class FeedNoticiasPage {
    noticias: any[] = [];
    loading = true;

    constructor(
        public http: Http,
        public navCtrl: NavController,
        public platform: Platform) {
        moment.locale('es');
        // '
        let url;
        if (this.platform.is('core')) {
            url = '/feed';
        } else {
            url = 'http://www.saludneuquen.gob.ar/feed/';
        }
        this.http.get(url)
            .map(res => res.text())
            .subscribe(data => {
                this.loading = false;
                if (data) {
                    let parser = new DOMParser();
                    let xmlData = parser.parseFromString(data, 'application/xml');
                    let items = xmlData.querySelectorAll('item');
                    for (let index = 0; index < items.length; index++) {
                        let element = items[index];
                        let title = element.getElementsByTagName('title')[0].innerHTML;
                        let link = element.getElementsByTagName('link')[0].innerHTML;
                        let date = new Date(element.getElementsByTagName('pubDate')[0].innerHTML);

                        let description = element.getElementsByTagName('description')[0].textContent;
                        let category = element.getElementsByTagName('category')[0].textContent;
                        let content = element.getElementsByTagName('content:encoded')[0].textContent;

                        let div = document.createElement('div');
                        div.innerHTML = content;
                        description = div.textContent || div.innerText || '';
                        let imgs = div.getElementsByTagName('img');
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
