import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController, NavParams, LoadingController, MenuController, Platform } from 'ionic-angular';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { Base64 } from '@ionic-native/base64';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { NativeGeocoder } from '@ionic-native/native-geocoder';

// pages
import { DondeVivoDondeTrabajoPage } from './donde-vivo-donde-trabajo/donde-vivo-donde-trabajo';

// providers
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { EditorPacientePage } from '../editor-paciente/editor-paciente';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from '../../../providers/paciente';
import { ConstanteProvider } from '../../../providers/constantes';
import { ToastProvider } from '../../../providers/toast';

@Component({
    selector: 'page-profile-contacto',
    templateUrl: 'profile-contactos.html',
})
export class ProfileContactosPage {
    emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    phoneRegex = /^[1-3][0-9]{9}$/;

    contactType = [
        'celular',
        'fijo'
    ];

    reportarError: any;
    paciente: any = null;
    contactos: any[];

    _telefono: string;
    _email: string;


    inProgress = false;
    constructor(
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

    ionViewDidLoad() {
        this.paciente = this.pacienteProvider.paciente;
        let emailData = this.paciente.contacto.find(item => item.tipo === 'email'  );
        if (emailData) {
            this._email = emailData.valor;
        }
        let phoneData = this.paciente.contacto.find(item => item.tipo === 'celular'  );
        if (phoneData) {
            this._telefono = phoneData.valor;
        }
    }

    ionViewDidEnter() {

    }

    reportarChange() {
        // console.log('Cucumbers new state:' + this.reportarError);
    }


    onEdit() {
        this.navCtrl.push(EditorPacientePage, { paciente: this.paciente });
    }

    onSave() {
        let contactos = [];
        if (this._telefono.length && !this.phoneRegex.test(this._telefono)) {
            this.toast.danger('CELULAR INCORRECTO');
            return;
        }
        if (this._email.length && !this.emailRegex.test(this._email)) {
            this.toast.danger('EMAIL INCORRECTO');
            return;
        }

        if (this._telefono.length) {
            contactos.push({
                tipo: 'celular',
                valor: this._telefono
            });
        }

        if (this._email.length) {
            contactos.push({
                tipo: 'email',
                valor: this._email
            });
        }

        let data = {
            contacto: contactos
        };


        this.pacienteProvider.update(this.paciente.id, data).then(() => {
            this.toast.success('DATOS MODIFICADOS CORRECTAMENTE');
        })

    }




}
