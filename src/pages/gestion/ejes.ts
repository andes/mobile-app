import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, Content } from 'ionic-angular';
import { IPageGestion } from 'interfaces/pagesGestion';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { PagesGestionProvider } from '../../providers/pageGestion';

@Component({
    selector: 'ejes',
    templateUrl: 'ejes.html',
})

export class EjesComponent implements OnInit {
    @Input() activePage: IPageGestion;

    public backPage: IPageGestion;
    public pagesList: IPageGestion;
    constructor(
        public navCtrl: NavController,
        public pagesGestionProvider: PagesGestionProvider,
    ) { }

    ngOnInit() {
        this.activePage = this.pagesList['2'];
        console.log('this.active EJES', this.activePage);
        this.loadPages();
    }
    loadPages() {


    }

    cambiarPagina(page) {
        console.log('cambiar pagina')
        this.backPage = Object.assign({}, this.activePage);
        // this.navCtrl.push(Principal, { page });
    }

}
