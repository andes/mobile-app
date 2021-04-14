import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    pacienteMenu = [
        { title: 'Datos Personales', url: 'profile/view-profile', icon: 'person-circle-outline' },
        { title: 'Configurar cuenta', url: 'profile/account', icon: 'key-outline' },
        { title: 'Mi historial de turnos', url: 'turnos/historial', icon: 'document-text-outline' },
        { title: 'Punto saludable', url: 'datos-utiles/punto-saludable', icon: 'navigate-circle-outline' },
        // { title: 'NotiSalud', url: 'datos-utiles/noticias', icon: 'newspaper-outline' },
        { title: 'Preguntas frecuentes', url: 'datos-utiles/faq', icon: 'help-circle-outline' },
    ];

    profesionalMenuOriginal: any = [
        { title: 'Datos personales', url: 'profesional/profile', icon: 'person-circle-outline', esGestion: 'no' },
        { title: 'Punto saludable', url: 'datos-utiles/punto-saludable', icon: 'navigate-circle-outline', esGestion: 'no' },
        { title: 'Preguntas frecuentes', url: 'datos-utiles/faq', icon: 'help-circle-outline', esGestion: 'no' },
        // { title: 'NotiSalud', url: 'datos-utiles/noticias', icon: 'newspaper-outline', esGestion: 'no'},
    ];

    profesionalMenu = this.profesionalMenuOriginal.slice();

    anonymousMenu = [
        { title: 'Ingresar en ANDES', url: '/login', color: 'primary', icon: 'log-in-outline' },
        { title: 'Punto saludable', url: 'datos-utiles/punto-saludable', icon: 'navigate-circle-outline' },
        { title: 'Preguntas frecuentes', url: 'datos-utiles/faq', icon: 'help-circle-outline' },
        // { title: 'NotiSalud', url: 'datos-utiles/noticias', icon: 'newspaper-outline' },
    ];

    menu$ = new BehaviorSubject<any>(null);

    private eventSubject = new BehaviorSubject<any>(null);

    setTipoIngreso(data: any) {
        this.eventSubject.next(data);
    }

    getTipoIngreso() {
        return this.eventSubject.value;
    }

    public checkTipoIngreso(tipo) {
        this.profesionalMenu = this.profesionalMenuOriginal.slice();

        switch (tipo) {
            case 'gestion':
                this.profesionalMenu = this.profesionalMenu.map(x => {
                    x.esGestion = 'si';
                    return x;
                });
                if (!this.profesionalMenu.find(x => x.id === 'profesional')) {
                    this.profesionalMenu.unshift({
                        icon: 'swap-horizontal-outline',
                        title: 'Ingresar como Profesional',
                        url: '/login/organizaciones',
                        id: 'profesional'
                    });
                    const existeRegenerar = this.profesionalMenu.find(x => x.id === 'clean');
                    if (!existeRegenerar) {
                        const pos = this.profesionalMenu.length - 1;
                        this.profesionalMenu.splice(pos, 0, {
                            icon: 'refresh-outline',
                            title: 'Regenerar indicadores',
                            action: 'cleanCache', id: 'refresh-outline'
                        });
                    }
                    this.menu$.next(this.profesionalMenu);
                    return this.profesionalMenu;
                }
                break;
            case 'profesional':
                this.profesionalMenu = this.profesionalMenu.map(x => {
                    x.esGestion = 'no';
                    return x;
                });
                if (!this.profesionalMenu.find(x => x.id === 'gestion')) {
                    this.profesionalMenu.unshift({
                        icon: 'business-outline',
                        title: 'Cambiar de organización',
                        url: '/login/organizaciones',
                        id: 'gestion'
                    });
                    this.profesionalMenu.unshift({
                        icon: 'swap-horizontal-outline',
                        title: 'Ingresar como Gestión',
                        url: '/login/disclaimer',
                        id: 'gestion'
                    });
                    this.menu$.next(this.profesionalMenu);
                    return this.profesionalMenu;
                }
                break;
            default:
                this.menu$.next(this.anonymousMenu);
                return this.anonymousMenu;

                break;
        }

    }

    getMenu() {
        return this.menu$.value;
    }
}
