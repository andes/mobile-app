import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { DomSanitizer } from '@angular/platform-browser';
// providers
import { AuthProvider } from 'src/providers/auth/auth';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from 'src/providers/paciente';
import { ToastProvider } from 'src/providers/toast';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile-paciente',
    templateUrl: 'profile-paciente.html',
})

export class ProfilePacientePage implements OnInit {
    constructor(
        private router: Router,
        private storage: Storage,
        private authService: AuthProvider,
        private loadingCtrl: LoadingController,
        private pacienteProvider: PacienteProvider,
        private toast: ToastProvider,
        private photoViewer: PhotoViewer,
        private sanitizer: DomSanitizer) {
    }

    emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    phoneRegex = /^[1-3][0-9]{9}$/;
    showPersonal = false;
    showContactos = false;
    showDondeVivo = false;
    showDondeTrabajo = false;
    contactType = [
        'celular',
        'fijo'
    ];
    reportarError: any;
    paciente: any = null;
    contactos: any[];
    direcciones: any[];
    telefonos: any[];
    emails: any[];
    provSelect: any;
    localidadSelect: any;
    direccion = '';
    provincias: any = [];
    localidades: any = [];
    direccionDondeVivo: any = {};
    direccionDondeTrabajo: any = {};
    photo: any;
    mapObject: any;
    inProgress = false;
    loading: any = null;
    public familiar: any = false;

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            let pacienteId;
            if (value) {
                pacienteId = value.id;
                this.familiar = true;
            } else {
                pacienteId = this.authService.user.pacientes[0].id;
            }
            if (!this.authService.user) {
                this.router.navigate(['home']);
            }

            this.inProgress = true;
            this.pacienteProvider.get(pacienteId).then((paciente: any) => {
                this.inProgress = false;
                this.paciente = paciente;
                this.contactos = paciente.contacto;
                this.direcciones = paciente.direccion;

                this.telefonos = paciente.contacto.filter(item => item.tipo !== 'email');
                this.emails = paciente.contacto.filter(item => item.tipo === 'email');

                this.telefonos.push({ tipo: 'celular', valor: '' });
                this.emails.push({ tipo: 'email', valor: '' });

                if (this.paciente.fotoMobile) {
                    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(this.paciente.fotoMobile);
                }
            }).catch(() => {
                this.inProgress = false;
            });
        });
    }

    fechaNacimiento() {
        return moment(this.paciente.fechaNacimiento).format('DD/MM/YYYY');
    }

    onInputChange(list, newType) {
        const last = list.length - 1;
        if (list[last].valor.length > 0) {
            list.push({ tipo: newType, valor: '' });
        } else if (list.length > 1 && list[last - 1].valor.length === 0) {
            list.pop();
        }
    }

    togglePersonales() {
        if (this.showPersonal) {
            this.showPersonal = false;
        } else {
            this.showPersonal = true;
            this.showContactos = this.showDondeTrabajo = this.showDondeVivo = false;
        }
    }

    toggleContactos() {
        if (this.showContactos) {
            this.showContactos = false;
        } else {
            this.showContactos = true;
            this.showPersonal = this.showDondeTrabajo = this.showDondeVivo = false;
        }
    }

    toggleDondeVivo() {
        if (this.showDondeVivo) {
            this.showDondeVivo = false;
        } else {
            this.showDondeVivo = true;
            this.showContactos = this.showPersonal = this.showDondeTrabajo = false;
        }
    }

    toggleDondeTrabajo() {
        if (this.showDondeTrabajo) {
            this.showDondeTrabajo = false;
        } else {
            this.showDondeTrabajo = true;
            this.showContactos = this.showPersonal = this.showDondeTrabajo = false;
        }
    }

    // onEdit() {
    //     this.router.navigate(['profile/editor-paciente']);
    // }

    onSave() {
        let canSave = false;

        this.telefonos.splice(-1, 1);
        this.emails.splice(-1, 1);
        this.contactos = [...this.telefonos, ...this.emails];

        for (const contacto of this.contactos) {

            switch (contacto.tipo) {
                case 'email':
                    if (!this.emailRegex.test(contacto.valor)) {
                        this.toast.danger('E-mail inválido');
                        this.telefonos.push({ tipo: 'celular', valor: '' });
                        this.emails.push({ tipo: 'email', valor: '' });

                        return;
                    }
                    break;
                case 'fijo':
                case 'celular':
                    if (!this.phoneRegex.test(contacto.valor)) {
                        this.toast.danger('Nro de teléfono inválido');
                        this.telefonos.push({ tipo: 'celular', valor: '' });
                        this.emails.push({ tipo: 'email', valor: '' });

                        return;
                    }
                    break;
            }
        }

        if (this.contactos.length > 0) {
            canSave = true;
        }

        if (!canSave) {
            this.telefonos.push({ tipo: 'celular', valor: '' });
            this.emails.push({ tipo: 'email', valor: '' });

            this.toast.danger('Debe indicar al menos un número de teléfono o email');
            return false;
        }

        const data = {
            contacto: this.contactos
        };

        this.pacienteProvider.update(this.paciente.id, data).then(() => {
            this.toast.success('Sus datos fueron modificados correctamente.');
            this.telefonos.push({ tipo: 'celular', valor: '' });
            this.emails.push({ tipo: 'email', valor: '' });
        });
    }

    async showLoader() {
        this.loading = await this.loadingCtrl.create({
            message: 'Actualizando foto...'
        });
        this.loading.present();
    }

    openPhoto() {
        this.photoViewer.show(this.photo);
    }
}
