
import { Component, OnInit } from '@angular/core';

import { NavParams, NavController } from '@ionic/angular';
import { AuthProvider } from './../../../../providers/auth/auth';
@Component({
    selector: 'app-popover',
    templateUrl: './popover.page.html',
    styleUrls: ['./popover.page.scss'],
})

export class PopoverPage implements OnInit {
    public callback: any;
    origen;
    user;
    esDirector;
    esJefeZona;
    public cargaMinuta = false;
    constructor(public viewCtrl: NavController, private params: NavParams, public authProvider: AuthProvider)
    {
        this.origen = this.params.get('origen');
        this.callback = this.params.get('callback');
        this.user = this.authProvider.user;
        this.esDirector = this.authProvider.checkCargo('Director');
        this.esJefeZona = this.authProvider.checkCargo('JefeZona');
        this.cargaMinuta = this.origen !== 'zona' && this.origen !== 'Efector';
    }

   ngOnInit() {
   }

    close(action) {
        // this.viewCtrl.consumeTransition();
        this.callback(action);
    }
}
