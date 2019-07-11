import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
@Component({
    selector: 'popOver',
    templateUrl: 'popover.html'
})

export class PopOver {
    public callback: any;

    constructor(public viewCtrl: ViewController, private params: NavParams) {
        this.callback = this.params.get('callback');
    }

    close(action) {
        this.viewCtrl.dismiss();
        this.callback(action);
    }
}
