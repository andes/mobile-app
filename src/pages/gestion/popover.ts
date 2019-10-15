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
    constructor(public viewCtrl: ViewController, private params: NavParams, public authProvider: AuthProvider,) {
        console.log(this.params)
        this.origen = this.params.get('origen')
        this.callback = this.params.get('callback');
        this.user = this.authProvider.user;
        this.esDirector = this.user.permisos.findIndex(x => x === 'Director');
        this.esJefeZona = this.user.permisos.findIndex(x => x === 'JefeZona');

        console.log("permisos",this.esDirector,this.esJefeZona)
    }

    close(action) {
        this.viewCtrl.dismiss();
        this.callback(action);
    }
}
