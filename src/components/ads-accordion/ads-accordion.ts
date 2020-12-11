import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'app-ads-accordion',
    template: `
        <div class="ads-accordion" [ngClass]="{'open': isOpen}">
            <div class="ads-accordion-header" (click)="onHeaderClick()">
                <div class="ads-header-container">
                <h2>
                    {{header}}
                    <ng-content select="[header]"></ng-content>
                </h2>
                <h4>
                    <ng-content select="[subtitulo]"></ng-content>
                </h4>
                </div>
                <ion-icon class="outline" name="ios-arrow-down-outline"></ion-icon>
            </div>
            <div class="ads-accordion-content">
                <ng-content select="[content]"></ng-content>
            </div>
        </div>`,
    styleUrls: [
        `ads-accordion.scss`
    ]
})
export class AdsAccordionPage {

    @Input() header;
    @Input() subtitulo;
    @Input() content;

    @Output() toggleEvent: EventEmitter<any> = new EventEmitter();

    public prevent = true;
    public isOpen = false;

    toggle(state: boolean) {
        this.isOpen = state;
    }

    onHeaderClick() {
        if (this.prevent) {
            this.isOpen = !this.isOpen;
        }
        this.toggleEvent.emit(this.isOpen);
    }

}
