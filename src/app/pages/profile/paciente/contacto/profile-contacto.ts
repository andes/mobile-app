import { Component, OnInit } from '@angular/core';
// providers
import { AuthProvider } from 'src/providers/auth/auth';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from 'src/providers/paciente';
import { ToastProvider } from 'src/providers/toast';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile-contacto',
    templateUrl: 'profile-contacto.html',
})
export class ProfileContactoPage implements OnInit {
    emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    phoneRegex = /^[1-3][0-9]{9}$/;

    contactType = [
        'celular',
        'fijo'
    ];

    reportarError: any;
    contactos: any[];

    telefono: string;
    email: string;
    paciente: any = {};

    inProgress = false;
    public familiar: any = false;

    constructor(
        private router: Router,
        private storage: Storage,
        private authService: AuthProvider,
        private pacienteProvider: PacienteProvider,
        private toast: ToastProvider) {
    }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            let pacienteId = null;
            if (value) {
                pacienteId = value.id;
                this.familiar = true;
            } else {
                if (this.authService.user.pacientes && this.authService.user.pacientes[0]) {
                    pacienteId = this.authService.user.pacientes[0].id;
                }
            }
            this.pacienteProvider.get(pacienteId).then((paciente: any) => {
                this.paciente = paciente;
                const emailData = this.paciente.contacto.find(item => item.tipo === 'email');
                if (emailData) {
                    this.email = emailData.valor;
                }
                const phoneData = this.paciente.contacto.find(item => item.tipo === 'celular');
                if (phoneData) {
                    this.telefono = phoneData.valor;
                }
            });
        });
    }

    onEdit() {
        this.router.navigate(['profile/editor-paciente']);
    }

    onSave() {
        const contactos = [];
        if (this.telefono && !this.phoneRegex.test(this.telefono)) {
            this.toast.danger('Número de móvil inválido.');
            return;
        }
        if (this.email && !this.emailRegex.test(this.email)) {
            this.toast.danger('Formato de e-mail incorrecto.');
            return;
        }
        if (this.telefono) {
            contactos.push({
                tipo: 'celular',
                valor: this.telefono
            });
        }
        if (this.email) {
            contactos.push({
                tipo: 'email',
                valor: this.email
            });
        }
        const data = {
            contacto: contactos
        };
        this.pacienteProvider.update(this.paciente.id, data).then(() => {
            this.toast.success('Datos de contacto actualizados.');
        }).catch(() => {
            this.inProgress = false;
            this.toast.danger('Hubo un problema al actualizar los datos.');
        });
    }
}
