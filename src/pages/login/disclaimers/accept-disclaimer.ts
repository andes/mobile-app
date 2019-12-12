import { AuthProvider } from './../../../providers/auth/auth';
import { DisclaimersProvider } from '../../../providers/auth/disclaimer';
import { LoginPage } from './../login';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, Platform } from 'ionic-angular';

// pages

// providers
import { DeviceProvider } from '../../../providers/auth/device';
import { ConstanteProvider } from '../../../providers/constantes';
import { ToastProvider } from '../../../providers/toast';
import { Principal } from '../../gestion/principal';
import { OrganizacionesPage } from '../organizaciones/organizaciones';
import { HomePage } from '../../home/home';
import * as shiroTrie from 'shiro-trie';

@Component({
    selector: 'page-disclaimer',
    templateUrl: 'accept-disclaimer.html'
})
export class DisclaimerPage {
    usuario: String;
    password: String;
    version: String;
    texto: String;
    disclaimer: any;

    constructor(
        public storage: Storage,
        public assetsService: ConstanteProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        public deviceProvider: DeviceProvider,
        public platform: Platform,
        public toastCtrl: ToastProvider,
        public authProvider: AuthProvider,
        public disclaimerProvider: DisclaimersProvider) {

    }

    ionViewDidLoad() {
        let pendingDisclaimer = false;
        this.disclaimerProvider.get({ activo: true }).then((disclaimers: any) => {
            if (disclaimers && disclaimers.length) {
                let disclaimer = disclaimers[0];
                this.authProvider.getDisclaimers(this.authProvider.user).then((userDisclaimers: any) => {
                    let coincidencias = userDisclaimers.filter((item: any) => {
                        return (item.id === disclaimer.id);
                    })
                    if (coincidencias.length > 0) {
                        pendingDisclaimer = false;
                    } else {
                        pendingDisclaimer = true;
                    }
                    if (pendingDisclaimer) {
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
        this.navCtrl.setRoot(HomePage);
    }

    aceptarDisclaimer() {
        this.authProvider.saveDisclaimer(this.authProvider.user, this.disclaimer).then(() => {
            this.redirectAccepted();
        });
    }

    redirectAccepted() {
        let usuario = this.authProvider.user;
        let tienePermiso = false;
        const shiro = shiroTrie.newTrie();
        shiro.add(usuario.permisos);
        if (shiro.check('appGestion:accesoIndicadores')) {
            tienePermiso = true;
        }
        if (usuario && usuario.esGestion && tienePermiso) {
            let params = {
                esGestion: usuario.esGestion ? usuario.esGestion : false,
                mantenerSesion: usuario.mantenerSesion ? usuario.mantenerSesion : true
            };
            this.navCtrl.setRoot(Principal, params);
        } else {
            this.navCtrl.setRoot(OrganizacionesPage);
        }

    }
}
