import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    pacienteMenu = [
        { title: 'Datos Personales', url: 'profile/view-profile', icon: 'person-circle-outline' },
        { title: 'Configurar cuenta', url: 'profile/account', icon: 'key-outline' },
        { title: 'Mi historial de turnos', url: 'turnos/historial', icon: 'document-text-outline' },
        { title: 'Preguntas frecuentes', url: 'datos-utiles/faq', icon: 'help-circle-outline' }
    ];

    profesionalMenuOriginal: any = [
        { title: 'Datos personales', url: 'profesional/profile', icon: 'person-circle-outline', esGestion: 'no' },
        { title: 'Registrarse en ANDES', url: 'login/informacion-validacion', icon: 'person-add-outline' },
        { title: 'Preguntas frecuentes', url: 'datos-utiles/faq', icon: 'help-circle-outline', esGestion: 'no' }
    ];

    profesionalMenu = this.profesionalMenuOriginal.slice();

    anonymousMenu = [
        { title: 'Preguntas frecuentes', url: 'datos-utiles/faq', icon: 'help-circle-outline' }
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
            case 'profesional':
                this.menu$.next(this.profesionalMenu);
                return this.profesionalMenu;
            default:
                this.menu$.next(this.anonymousMenu);
                return this.anonymousMenu;

        }

    }

    getMenu() {
        return this.menu$.value;
    }
}
