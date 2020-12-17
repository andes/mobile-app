import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
// providers
import { AuthProvider } from 'src/providers/auth/auth';

@Component({
    selector: 'app-profile-profesional',
    templateUrl: 'profile-profesional.html',
})
export class ProfileProfesionalComponent implements OnInit {
    public profesional: any = null;
    public sesion;
    constructor(
        public authProvider: AuthProvider,
        public authService: AuthProvider,
        public menu: MenuController,
    ) {

    }
    ngOnInit() {
        this.profesional = this.authService.user;
        this.recuperarSesion();
        console.log('sesion ', this.sesion);
    }

    cambiarSesion() {
        console.log(' on select sesion ', this.sesion);
        this.authProvider.cambiarSesion(this.sesion);
    }
    async recuperarSesion() {
        this.sesion = await this.authProvider.checkSession();
    }
}
