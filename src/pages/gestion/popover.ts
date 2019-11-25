import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
@Component({
    selector: 'popOver',
    templateUrl: 'popover.html'
})

export class PopOver {
    public callback: any;
    origen;
    user;
    esDirector;
    esJefeZona;
    constructor(public viewCtrl: ViewController, private params: NavParams, public authProvider: AuthProvider) {
        this.origen = this.params.get('origen')
        this.callback = this.params.get('callback');
        this.user = this.authProvider.user;
        this.esDirector = this.authProvider.checkCargo('Director');
        this.esJefeZona = this.authProvider.checkCargo('JefeZona');
    }

    close(action) {
        this.viewCtrl.dismiss();
        this.callback(action);
    }
}
