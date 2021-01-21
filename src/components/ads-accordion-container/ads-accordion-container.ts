import { AfterViewInit, Component, ContentChildren } from '@angular/core';
import { AdsAccordionPage } from '../ads-accordion/ads-accordion';

@Component({
    selector: 'app-ads-accordion-container',
    template: `
        <div>
            <ng-content></ng-content>
        </div>`
})
export class AdsAccordionContainerPage implements AfterViewInit {
    @ContentChildren(AdsAccordionPage) childsComponents;

    constructor() { }

    ngAfterViewInit() {
        this.childsComponents.forEach((component: AdsAccordionPage) => {
            component.prevent = true;
            component.toggleEvent.subscribe((state) => {
                this.childsComponents.forEach((childComponent: AdsAccordionPage) => {
                    childComponent.toggle(false);
                });
                component.toggle(state);
            });
        });
    }
}
