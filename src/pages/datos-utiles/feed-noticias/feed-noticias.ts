import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';
import { Http, Headers } from '@angular/http';

// pages

// providers

@Component({
  selector: 'page-feed-noticias',
  templateUrl: 'feed-noticias.html'
})
export class FeedNoticiasPage {
  mostrarMenu: boolean = false;
  noticias: any[] = [];
  loading = true;

  constructor(
    public http: Http,
    public navCtrl: NavController) {
    moment.locale('es');
    // 'http://www.saludneuquen.gob.ar/feed/
    this.http.get('/feed')
      .map(res => res.text())
      .subscribe(data => {
        this.loading = false;
        if (data) {
          var parser = new DOMParser();
          var xmlData = parser.parseFromString(data, "application/xml");
          var items = xmlData.querySelectorAll("item");
          for (var index = 0; index < items.length; index++) {
            var element = items[index];


            let title = element.getElementsByTagName('title')[0].innerHTML;
            let link = element.getElementsByTagName('link')[0].innerHTML;
            let date = new Date(element.getElementsByTagName('pubDate')[0].innerHTML);

            let description = element.getElementsByTagName('description')[0].textContent;

            var div = document.createElement("div");
            div.innerHTML = description;
            description = div.textContent || div.innerText || "";

            this.noticias.push({ title, link, date, description });

            // console.log(title, link, date);
            console.log(element);
          }

        }
        else {

        }

      });

  }

  formatDate(noticia) {
    return moment(noticia.date).format('DD MMM');
  }

  call(farmacia) {
    window.open('tel:' + farmacia.telefono);
  }


}
