import { Component, OnInit } from '@angular/core';
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
        private authProvider: AuthProvider,
        private authService: AuthProvider) {

    }
    ngOnInit() {
        this.profesional = this.authService.user;
        this.recuperarSesion();
    }

    cambiarSesion() {
        this.authProvider.cambiarSesion(this.sesion);
    }
    async recuperarSesion() {
        this.sesion = await this.authProvider.checkSession();
    }
}
