import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { AdsAccordionPage } from '../../../../components/ads-accordion/ads-accordion';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-faq',
    templateUrl: 'faq.html',
})
export class FaqPage implements OnInit {
    public faqs: any = [];
    public familiar: any = false;
    @ViewChildren(AdsAccordionPage) childsComponents: QueryList<AdsAccordionPage>;

    constructor(private storage: Storage) {
    }

    ngOnInit(): void {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
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
