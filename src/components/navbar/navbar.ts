import { Component, Input } from '@angular/core';
import { MenuController } from 'ionic-angular';

@Component({
    selector: 'page-navbar',
    templateUrl: 'navbar.html',
})
export class NavbarPage {
    _menu: boolean;

    get menu(): boolean {
        return this._menu;
    }

    @Input('menu')
    set menu(value: boolean) {
        this._menu = value;
        this.menuCtrl.enable(this._menu);
    }

    ionViewDidLoad() {
        //
    }

    constructor(public menuCtrl: MenuController) {

    }
}
