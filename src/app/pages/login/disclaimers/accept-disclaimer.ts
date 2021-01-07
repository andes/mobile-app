import { AuthProvider } from './../../../../providers/auth/auth';
import { DisclaimersProvider } from '../../../../providers/auth/disclaimer';
import { Component } from '@angular/core';

// providers
import { DeviceProvider } from '../../../../providers/auth/device';
import { ToastProvider } from '../../../../providers/toast';
// import { Principal } from '../../gestion/principal';
// import { OrganizacionesPage } from '../organizaciones/organizaciones';
import * as shiroTrie from 'shiro-trie';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/providers/events.service';

@Component({
    selector: 'app-disclaimer',
    templateUrl: 'accept-disclaimer.html'
})
export class DisclaimerPage {
    usuario: string;
    password: string;
    version: string;
    texto: string;
    disclaimer: any;
    pendingDisclaimer = false;

    constructor(
        public deviceProvider: DeviceProvider,
        public toastCtrl: ToastProvider,
        public events: EventsService,
        public authProvider: AuthProvider,
        public disclaimerProvider: DisclaimersProvider,
        public router: Router) {

    }

    ionViewWillEnter() {
        this.disclaimerProvider.get({ activo: true }).then(async (disclaimers: any) => {
            if (disclaimers && disclaimers.length) {
                const disclaimer = disclaimers[0];
                this.authProvider.getDisclaimers(this.authProvider.user).then(async (userDisclaimers: any) => {
                    const coincidencias = userDisclaimers.filter((item: any) => {
                        return (item.id === disclaimer.id);
                    });
                    if (coincidencias.length > 0) {
                        this.pendingDisclaimer = false;
                    } else {
                        this.pendingDisclaimer = true;
                    }
                    if (this.pendingDisclaimer) {
                        this.disclaimerProvider.get({ activo: true }).then((data) => {
                            if (data) {
                                this.disclaimer = data[0];
                                this.version = this.disclaimer.version;
                                this.texto = this.disclaimer.texto;
                            }
                        }).catch(error => {
                            if (error) {
                                this.toastCtrl.danger('Ha ocurrido un error al traer los datos del disclaimer.');
                            }
                        });
                    } else {
                        this.redirectAccepted();
                    }
                }).catch(error => {
                    if (error) {
                        this.toastCtrl.danger('Ha ocurrido un error al obtener los disclaimers del usuario.');
                    }
                });
            } else {
                this.redirectAccepted();
            }
        }).catch(error => {
            if (error) {
                this.toastCtrl.danger('Ha ocurrido un error al obtener los disclaimers.');
            }
        });
    }

    logout() {
        this.deviceProvider.remove().then(() => true, () => true).catch(error => {
            if (error) {
                this.toastCtrl.danger('Error al cerrar sesión.');
            }
        });
        this.authProvider.logout();
        this.router.navigate(['home']);
    }

    aceptarDisclaimer() {
        this.authProvider.saveDisclaimer(this.authProvider.user, this.disclaimer).then(() => {
            this.redirectAccepted();
        });
    }

    redirectAccepted() {
        const usuario = this.authProvider.user;
        let tienePermiso = false;
        const shiro = shiroTrie.newTrie();
        shiro.add(usuario.permisos);
        if (shiro.check('appGestion:accesoIndicadores')) {
            tienePermiso = true;
        }
        if (usuario && usuario.esGestion && tienePermiso) {
            const params = {
                esGestion: usuario.esGestion ? usuario.esGestion : false,
                mantenerSesion: usuario.mantenerSesion ? usuario.mantenerSesion : true
            };
            this.events.setTipoIngreso('gestion');
            this.router.navigate(['gestion'], { queryParams: params });
            // this.navCtrl.setRoot(Principal, params);
        } else {
            this.router.navigate(['login/organizaciones']);
        }

    }
}
