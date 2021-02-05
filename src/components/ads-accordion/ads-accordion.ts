import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'app-ads-accordion',
    template: `
        <div class="ads-accordion" [ngClass]="{'open': isOpen}">
            <div class="ads-accordion-header" (click)="onHeaderClick()">
                <div class="ads-header-container">
                <div class="header">
                    <ng-content select="[header]"></ng-content>
                </div>
                <div class="subtitulo">
                    <ng-content select="[subtitulo]"></ng-content>
                </div>
                </div>
                <ion-icon class="outline" name="chevron-down-outline"></ion-icon>
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
