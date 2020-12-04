import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController, NavParams, LoadingController, MenuController, Platform } from '@ionic/angular';
// import { Crop } from '@ionic-native/crop';
// import { NativeGeocoder } from '@ionic-native/native-geocoder';

// providers
import { AlertController } from '@ionic/angular';
import { AuthProvider } from 'src/providers/auth/auth';
// import { EditorPacientePage } from '../editor-paciente/editor-paciente';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from 'src/providers/paciente';
import { ConstanteProvider } from 'src/providers/constantes';
import { ToastProvider } from 'src/providers/toast';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile-contacto',
    templateUrl: 'profile-contacto.html',
})
export class ProfileContactoPage implements OnInit{
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
    constructor(
        private router: Router,
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public formBuilder: FormBuilder,
        public pacienteProvider: PacienteProvider,
        public assetProvider: ConstanteProvider,
        public toast: ToastProvider,
        public platform: Platform) {
        // this.menu.swipeEnable(false);

    }

    ngOnInit() {
        const pacienteId = this.authService.user.pacientes[0].id;
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
    }

    ionViewDidEnter() {

    }

    reportarChange() {
        // console.log('Cucumbers new state:' + this.reportarError);
    }


    onEdit() {
        this.router.navigate(['profile/editor-paciente']);
        // this.navCtrl.push(EditorPacientePage, { paciente: this.paciente });
    }

    onSave() {
        const contactos = [];
        if (this.telefono && !this.phoneRegex.test(this.telefono)) {
            this.toast.danger('CELULAR INCORRECTO');
            return;
        }
        if (this.email && !this.emailRegex.test(this.email)) {
            this.toast.danger('EMAIL INCORRECTO');
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
            this.toast.success('DATOS MODIFICADOS CORRECTAMENTE');
        });

    }




}
