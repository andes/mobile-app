import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// providers
import { AuthProvider } from 'src/providers/auth/auth';
import { StorageService } from 'src/providers/storage-provider.service';
import { PacienteProvider } from 'src/providers/paciente';
import { ToastProvider } from 'src/providers/toast';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

    @Input() editarContact = false;
    @Output() cancelarEditarContactoEvent = new EventEmitter<void>();

    reportarError: any;
    contactos: any[];

    telefono: string;
    email: string;
    paciente: any = {};

    inProgress = false;
    public familiar: any = false;

    constructor(
        private router: Router,
        private storage: StorageService,
        private authService: AuthProvider,
        private pacienteProvider: PacienteProvider,
        private toast: ToastProvider,
        public alertController: AlertController) {
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

    public async modal() {
        if (this.telefono && this.email) {
            const confirm = await this.alertController.create({
                header: 'Actualizar Contacto',
                message: '¿Está seguro que desea actualizar sus datos en el sistema de salud?',
                buttons: [
                    {
                        text: 'Cancelar',
                        handler: () => {
                            // resolve();
                        }
                    },
                    {
                        text: 'Aceptar',
                        handler: () => {
                            this.onSave();
                        }
                    }
                ]
            });
            await confirm.present();
        } else {
            const confirm = await this.alertController.create({
                header: 'Actualizar Contacto',
                message: 'Datos faltantes en su contacto. Recuerde colocar: ' + '<ul>' + '<li>E-mail</li>' + '<li>Móvil</li>' + '</ul>',
                buttons: [
                    {
                        text: 'Cerrar',
                        handler: () => {
                            // resolve();
                        }
                    }
                ]
            });
            await confirm.present();
        }


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
            this.cancelarEditar();
        }).catch(() => {
            this.inProgress = false;
            this.toast.danger('Hubo un problema al actualizar los datos.');
        });
    }

    public cancelarEditar() {
        this.editarContact = false;
        this.cancelarEditarContactoEvent.emit();
    }
}
