import { Component, OnInit } from '@angular/core';
import { MenuController } from 'ionic-angular';
import * as moment from 'moment';
// providers
import { AuthProvider } from '../../../providers/auth/auth';


@Component({
    selector: 'profile-profesional',
    templateUrl: 'profile-profesional.html',
})
export class ProfileProfesionalComponents implements OnInit {
    public profesional: any = null;
    public mantenerSesion = true;
    public esGestion = false;
    constructor(
        public authService: AuthProvider,
        public menu: MenuController,
    ) {

    }
    ngOnInit() {
        this.profesional = this.authService.user;
        this.esGestion = this.profesional.esGestion ? this.profesional.esGestion : false;
        this.mantenerSesion = this.profesional.mantenerSesion ? this.profesional.mantenerSesion : false
    };
    onSelect() {
        this.profesional.mantenerSesion = this.mantenerSesion;
    }
}
