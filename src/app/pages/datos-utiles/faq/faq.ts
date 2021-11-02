import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { AdsAccordionPage } from '../../../../components/ads-accordion/ads-accordion';
import { StorageService } from 'src/providers/storage-provider.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-faq',
    templateUrl: 'faq.html',
})
export class FaqPage implements OnInit {
    public faqs: any = [];
    public familiar: any = false;
    public backPage = 'home';

    @ViewChildren(AdsAccordionPage) childsComponents: QueryList<AdsAccordionPage>;

    constructor(
        private route: ActivatedRoute,
        private storage: StorageService
    ) {
    }

    ngOnInit(): void {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
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

    onHeaderClick(item) {
        if (item.show) {
            item.show = false;
        } else {
            this.faqs.forEach(faq => {
                faq.show = false;
            });
            item.show = true;
        }
    }
}
