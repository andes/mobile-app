import { Component, ViewChildren, QueryList } from '@angular/core';
import { AdsAccordionPage } from '../../../../components/ads-accordion/ads-accordion';

@Component({
    selector: 'app-faq',
    templateUrl: 'faq.html',
})
export class FaqPage {
    public faqs: any = [];
    @ViewChildren(AdsAccordionPage) childsComponents: QueryList<AdsAccordionPage>;

    constructor() {
    }

    onHeaderClick(item) {
        if (item.show) {
            item.show = false;
        } else {
            this.faqs.forEach(_item => {
                _item.show = false;
            });
            item.show = true;
        }
    }
}
