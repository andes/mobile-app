import { Component, Input, OnInit, Output, EventEmitter, QueryList, ViewChildren, AfterViewInit, AfterContentInit, AfterViewChecked, ContentChild, ContentChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AdsAccordionPage } from '../ads-accordion/ads-accordion';

@Component({
    selector: 'ads-accordion-container',
    template: '<ng-content></ng-content>'
})
export class AdsAccordionContainerPage implements AfterViewInit {
    @ContentChildren(AdsAccordionPage) childsComponents;

    ngAfterViewInit() {
        this.childsComponents.forEach((component: AdsAccordionPage) => {
            component.prevent = true;
            component.onToogle.subscribe((state) => {
                this.childsComponents.forEach((_component: AdsAccordionPage) => {
                    _component.toogle(false);
                });
                component.toogle(state);
            })
        });
    }

    ionViewDidLoad() {

    }
    constructor() {

    }
}
