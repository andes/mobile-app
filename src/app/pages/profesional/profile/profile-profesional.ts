import { ActivatedRoute } from '@angular/router';
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
    public backPage = 'home';

    constructor(
        private route: ActivatedRoute,
        private authProvider: AuthProvider,
        private authService: AuthProvider) {

    }
    ngOnInit() {
        this.profesional = this.authService.user;
        this.recuperarSesion();
    }

    ionViewWillEnter() {
        this.route.queryParams.subscribe(async params => {
            if (params.esGestion === 'si') {
                this.backPage = 'gestion';
            } else {
                this.backPage = 'home';
            }
        });
    }

    cambiarSesion() {
        this.authProvider.cambiarSesion(this.sesion);
    }
    async recuperarSesion() {
        this.sesion = await this.authProvider.checkSession();
    }
}
