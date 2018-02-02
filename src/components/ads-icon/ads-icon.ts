import { Component, Input } from '@angular/core';

@Component({
  selector: 'ads-icon',
  templateUrl: 'ads-icon.html',
})
export class AdsIconPage {

    @Input() icon: string = '';
    ionViewDidLoad() {
        //
    }

    constructor() {

    }
}
