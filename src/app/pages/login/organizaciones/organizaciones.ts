import { Component, OnInit } from '@angular/core';
import { NavParams, Platform } from '@ionic/angular';

// providers
import { DeviceProvider } from '../../../../providers/auth/device';

import { ConstanteProvider } from '../../../../providers/constantes';
import { AuthProvider } from '../../../../providers/auth/auth';
import { ToastProvider } from '../../../../providers/toast';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/providers/events.service';

@Component({
    selector: 'app-organizaciones',
    templateUrl: 'organizaciones.html'
})
export class OrganizacionesPage implements OnInit {
    tipoPrestacion: any[];
    organizaciones: any[] = null;
    usuario: string;
    password: string;

    constructor(
        private assetsService: ConstanteProvider,
        private navParams: NavParams,
        private toastCtrl: ToastProvider,
        private authProvider: AuthProvider,
        private events: EventsService,
        private router: Router
    ) {
        this.usuario = this.navParams.get('usuario');
        this.password = this.navParams.get('password');
    }

    ngOnInit() {
        this.assetsService.getOrganizaciones().then((data: any[]) => {
            this.organizaciones = data;
            if (this.organizaciones.length === 1) {
                this.onOrganizacionClick(this.organizaciones[0]);
            }
        });
    }

    onOrganizacionClick(organizacion) {
        this.authProvider.selectOrganizacion({ organizacion: organizacion.id }).then(() => {
            this.events.setTipoIngreso('profesional');
            this.events.checkTipoIngreso('profesional');
            this.router.navigate(['home']);
        }).catch(() => {
            this.toastCtrl.danger('Credenciales incorrectas');
        });

    }

}
