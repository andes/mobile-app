import { EventsService } from 'src/app/providers/events.service';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';

// providers

import { JwtHelperService } from '@auth0/angular-jwt';
import * as shiroTrie from 'shiro-trie';
import { DatosGestionProvider } from '../../providers/datos-gestion/datos-gestion.provider';
import { NetworkProvider } from 'src/providers/network';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthProvider {
    private shiro = shiroTrie.newTrie();
    private jwtHelper = new JwtHelperService();
    public userWatch: Observable<any>;

    public observer: any;

    public token: any;
    public user: any;
    public esDirector;
    public esJefeZona;
    public permisos;
    public esGestion;
    public mantenerSesion;
    private authUrl = 'modules/mobileApp';
    private authV2Url = 'modules/mobileApp/v2';

    private appUrl = 'auth';

    constructor(
        public storage: Storage,
        public network: NetworkProvider,
        private events: EventsService,
        public datosGestion: DatosGestionProvider
    ) {
        this.user = null;
        this.token = null;
        this.permisos = [];
        this.esGestion = false;
        this.mantenerSesion = true;
        this.storage.set('familiar', '');
    }

    getHeaders() {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        if (this.token) {
            headers.append('Authorization', 'JWT ' + this.token);
        }
        return headers;
    }

    checkCargo(unCargo) {
        const shiro = shiroTrie.newTrie();
        shiro.add(this.user.permisos);
        const cargo = shiro.permissions('appGestion:cargo:?').length > 0 ? shiro.permissions('appGestion:cargo:?')[0] : '';
        const salida = cargo === unCargo ? 1 : -1;
        return salida;
    }

    checkCargoEfector() {
        const shiro = shiroTrie.newTrie();
        shiro.add(this.user.permisos);
        const idEfector = shiro.permissions('appGestion:idEfector:?').length > 0 ? shiro.permissions('appGestion:idEfector:?')[0] : -1;
        return idEfector;
    }

    checkAuth() {
        return new Promise((resolve, reject) => {
            this.storage.get('token').then((token) => {
                if (!token) {
                    return reject();
                }
                this.storage.get('user').then((user) => {
                    if (!user) {
                        return reject();
                    }
                    this.token = token;
                    this.user = user;
                    this.esDirector = this.checkCargo('Director');
                    this.esJefeZona = this.checkCargo('JefeZona');
                    this.permisos = this.jwtHelper.decodeToken(token).permisos;
                    return resolve(user);
                });
            });
        });
    }



    checkGestion() {
        return this.storage.get('esGestion');
    }

    checkSession() {
        return this.storage.get('mantenerSesion');
    }
    cambiarSesion(sesion) {
        this.storage.set('mantenerSesion', sesion);
    }

    _createAccount(details) {
        return this.network.post(this.authUrl + '/registro', details, {});
    }
    updateAccount(details) {
        return this.network.patch(this.authUrl + '/account', details, {});
    }


    login(credentials) {
        return this.network.post(this.authUrl + '/login', credentials, {}).then((data: any) => {
            this.token = data.token;
            this.user = data.user;
            // let response =  await this.datosGestion.obtenerUnProf(this.user.documento);
            this.storage.set('token', data.token);
            this.storage.set('user', data.user);
            this.permisos = this.jwtHelper.decodeToken(data.token).permisos;
            this.network.setToken(data.token);
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    loginProfesional(credentials) {
        return this.network.post(this.appUrl + '/login', credentials, {}).then(async (data: any) => {
            this.token = data.token;
            this.user = data.user;
            this.storage.set('token', data.token);
            this.esDirector = this.checkCargo('Director');
            this.esJefeZona = this.checkCargo('JefeZona');
            if (this.esDirector >= 0 || this.esJefeZona >= 0) {
                const idEfectorPermiso = this.checkCargoEfector();
                const efector = await this.datosGestion.efectorPorId(idEfectorPermiso);
                if (efector.length > 0) {
                    data.user.idZona = efector[0].IdZona;
                    data.user.idArea = efector[0].IdArea;
                    data.user.idEfector = efector[0].idEfector;
                }

            }

            this.storage.set('user', data.user);
            this.esGestion = data.user.esGestion;
            this.storage.set('esGestion', String(data.user.esGestion));
            data.user.mantenerSesion = this.checkSession() ? this.checkSession() : true;
            this.storage.set('mantenerSesion', String(data.user.mantenerSesion));

            this.permisos = this.jwtHelper.decodeToken(data.token).permisos;
            this.network.setToken(data.token);
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    selectOrganizacion(org) {
        return this.network.post(this.appUrl + '/organizaciones', org, {}).then((data: any) => {
            this.token = data.token;
            this.storage.set('token', data.token);
            this.network.setToken(data.token);
            this.permisos = this.jwtHelper.decodeToken(data.token).permisos;
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }


    verificarCodigo(datos) {
        return this.network.post(this.authUrl + '/verificar-codigo', datos, {}).then((data: any) => {
            this.token = data.token;
            this.user = data.user;
            this.storage.set('token', data.token);
            this.storage.set('user', data.user);
            this.network.setToken(data.token);
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    reenviarCodigo(emailEnviado) {
        const email = { email: emailEnviado };
        return this.network.post(this.authUrl + '/reenviar-codigo', email, {});
    }

    logout() {
        this.storage.set('token', '');
        this.storage.set('user', '');
        this.storage.set('familiar', '');
        this.storage.remove('cantidadVacunasLocal');
        this.storage.remove('vacunas');
        this.storage.remove('info-bug');
        this.storage.remove('mantenerSesion');
        this.events.setTipoIngreso(null);
        this.token = null;
        this.user = null;
    }

    actualizarToken() {
        const params = {
            token: this.token
        };
        return this.network.post(this.appUrl + '/refreshToken', params, {}).then(async (data: any) => {
            this.token = data.token;
            this.storage.set('token', data.token);
            this.network.setToken(data.token);
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    update(params) {
        return this.network.put(this.authUrl + '/account', params, {}).then((data: any) => {
            this.user = data.account;
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }


    /**
     * Solo verificacmos que temos un código valido.
     * @param email Email de la cuenta
     * @param code Código de verificación
     */
    checkCode(email: string, code: string) {
        return this.network.post(this.authV2Url + '/check', { email, code });
    }

    /**
     * Validamos los datos del scanneo y el código.
     * @param email Email de la cuenta
     * @param code Código de verificación
     * @param scan Datos del escaneo
     */
    validarAccount(email: string, code: string, scan: object) {
        return this.network.post(this.authV2Url + '/verificar', { email, code, paciente: scan });
    }

    /**
     * Revalidamos todos los datos y creamos la cuenta
     * @param email Email de la cuenta
     * @param code Codigo de verificación
     * @param scan Datos del escaneo
     * @param password Password a setear
     */
    createAccount(email, code, scan, password) {
        return this.network.post(this.authV2Url + '/registrar', { email, code, password, paciente: scan }).then((data: any) => {

            this.token = data.token;
            this.user = data.user;
            this.storage.set('token', data.token);
            this.storage.set('user', data.user);
            this.network.setToken(data.token);
            return Promise.resolve(data);
        }).catch((err) => {
            return Promise.reject(err);
        });

    }

    /**
     * Generar un codigo para reestablecer contraseña y luego
     * enviar un email con el codigo generado
     *
     * @param email Email de la cuenta
     * @returns Promise
     */
    resetPassword(email) {
        return this.network.post(this.authUrl + '/olvide-password', { email }).then((res: any) => {
            return Promise.resolve(res);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    enviarCorreo(emails, asunto, mensaje, adjuntos) {
        const params = { emails, asunto, mensaje, adjuntos };
        return this.network.post(this.authUrl + '/mailGenerico', params).then((res: any) => {
            return Promise.resolve(res);
        }).catch((err) => {
            return Promise.reject(err);
        });
    }

    /**
     * Resetear el password de un usuario
     *
     * @param email Email del usuario al cambiar el password
     * @param codigo Codigo de verificación enviado por email
     * @param password Nuevo password
     * @param password2 Re ingreso de nuevo password
     */
    restorePassword(email, codigo, password, password2) {
        const dto = {
            email,
            codigo,
            password,
            password2
        };

        return this.network.post(this.authUrl + '/reestablecer-password', dto).then(res => {
            return Promise.resolve(res);
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    /**
     * Busca actualizaciones de la app mobile
     * @param appVersion Versión de la app
     */
    checkVersion(appVersion) {
        return this.network.post(this.authUrl + '/check-update', { appVersion }, {}, { hideNoNetwork: true });
    }

    /**
     * Check de permisos con shiro para profesionales
     * @param permiso Formato shiro
     */
    check(permiso) {
        this.shiro.reset();
        this.shiro.add(this.permisos);
        return this.shiro.permissions(permiso).length > 0;

    }

    saveDisclaimer(usuario: any, disclaimer: any) {
        if (usuario.email) {
            return this.network.post(`modules/gestor-usuarios/usuarios/${usuario.email}/disclaimers/${disclaimer.id}`,
                { usuario, disclaimer });
        }

    }

    getDisclaimers(usuario: any) {
        if (usuario.email) {
            return this.network.get(`modules/gestor-usuarios/usuarios/${usuario.email}/disclaimers`);
        }

    }

    checkExpiredToken() {
        if ((!this.token) || this.jwtHelper.isTokenExpired(this.token)) {
            return true;
        }
        return false;
    }

}
