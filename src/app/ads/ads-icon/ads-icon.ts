import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'ads-icon',
    template: '<span  [innerHTML]="svgIcon"></span>',
})
export class AdsIconPage implements OnInit {
    @Input() icon: string;
    svgIcon;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        const icons = require('!svg-inline-loader!../../../assets/svg/' + this.icon + '.svg');
        this.svgIcon = this.sanitizer.bypassSecurityTrustHtml(icons);
    }

}
