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
    selector: 'page-profile-paciente',
    templateUrl: 'profile-paciente.html',
})
export class ProfilePacientePage {
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

    photo: any = 'assets/img/user-profile-blank.jpg';

    mapObject: any;
    inProgress = false;
    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public formBuilder: FormBuilder,
        public menu: MenuController,
        public pacienteProvider: PacienteProvider,
        public assetProvider: ConstanteProvider,
        public toast: ToastProvider,
        private camera: Camera,
        private cropService: Crop,
        private imageResizer: ImageResizer,
        private base64: Base64,
        private photoViewer: PhotoViewer,
        private sanitizer: DomSanitizer,
        private nativeGeocoder: NativeGeocoder,
        public platform: Platform) {
        // this.menu.swipeEnable(false);

    }

    fechaNacimiento() {
        return moment(this.paciente.fechaNacimiento).format('DD/MM/YYYY')
    }

    ionViewDidLoad() {
        let pacienteId = this.authService.user.pacientes[0].id;
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

            // preparamos la direccion de trabajo
            // this.direccionDondeTrabajo = paciente.direccion.find( item => item.ranking == 1);
        }).catch(() => {
            this.inProgress = false;
        });

    }

    ionViewDidEnter() {

    }

    onInputChange(list, newType) {
        let last = list.length - 1;
        if (list[last].valor.length > 0) {
            list.push({ tipo: newType, valor: '' });
        } else if (list.length > 1 && list[last - 1].valor.length === 0) {
            list.pop();
        }
    }

    reportarChange() {
        // console.log('Cucumbers new state:' + this.reportarError);
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

    abrirDondeVivo() {
        this.navCtrl.push(DondeVivoDondeTrabajoPage, { tipo: 'Donde vivo' });
    }

    abrirDondeTrabajo() {
        this.navCtrl.push(DondeVivoDondeTrabajoPage, { tipo: 'Donde trabajo' });
    }

    toggleDondeTrabajo() {
        if (this.showDondeTrabajo) {
            this.showDondeTrabajo = false;
        } else {
            this.showDondeTrabajo = true;
            this.showContactos = this.showPersonal = this.showDondeTrabajo = false;
        }
    }

    onEdit() {
        this.navCtrl.push(EditorPacientePage, { paciente: this.paciente });
    }

    onSave() {
        let canSave = false;

        this.telefonos.splice(-1, 1);
        this.emails.splice(-1, 1);
        this.contactos = [...this.telefonos, ...this.emails];
        for (let i = 0; i < this.contactos.length; i++) {
            let contacto = this.contactos[i];
            switch (contacto.tipo) {
                case 'email':
                    if (!this.emailRegex.test(contacto.valor)) {
                        this.toast.danger('EMAIL INVALIDO');
                        this.telefonos.push({ tipo: 'celular', valor: '' });
                        this.emails.push({ tipo: 'email', valor: '' });

                        return;
                    }
                    break;
                case 'fijo':
                case 'celular':
                    if (!this.phoneRegex.test(contacto.valor)) {
                        this.toast.danger('TELEFONO INVALIDO');
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

        let data = {
            contacto: this.contactos
        };

        this.pacienteProvider.update(this.paciente.id, data).then(() => {
            this.toast.success('DATOS MODIFICADOS CORRECTAMENTE');
            this.telefonos.push({ tipo: 'celular', valor: '' });
            this.emails.push({ tipo: 'email', valor: '' });
            // this.navCtrl.setRoot(TurnosPage);
        })

    }

    takePhoto() {
        // let options = {
        //   quality: 80, // 80
        //   correctOrientation: true,
        //   destinationType: 2 // NATIVE_URI
        // } as CameraOptions;

        // // sacamos la foto
        // this.camera.getPicture(options).then((imageData) => {

        //   // cropeamos la foto que sacamos
        //   this.cropService.crop(imageData, { quality: 75 }).then((imageCropped) => {

        //     // por ultimo hacemos un resize
        //     let optionsResize = {
        //       uri: imageCropped,
        //       folderName: 'andes',
        //       quality: 50, //70
        //       width: 600,
        //       height: 600
        //     } as ImageResizerOptions;

        //     this.imageResizer.resize(optionsResize).then((filePath: string) => {
        //       // transformamos la foto en base64 para poder guardar en la base
        //       this.base64.encodeFile(filePath).then((base64File: string) => {
        //         // debemos sanatizar si o si el archivo en base64 generado para
        //         // poder mostrarlo en el browser y evitar ataques xss o lo que sea
        //         // Ref: https://angular.io/guide/security#xss
        //         this.showLoader();
        //         this.pacienteProvider.patch(this.paciente.id, { op: 'updateFotoMobile', fotoMobile: this.photo.changingThisBreaksApplicationSecurity }).then(() => {
        //           this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(base64File);
        //           this.loading.dismiss();
        //           this.toast.success('Foto de perfil actualizada');
        //         }, error => {
        //           this.loading.dismiss();
        //           this.toast.danger('Error al sacar la foto.');
        //         });
        //       }, (err) => {
        //         this.toast.danger('Error al sacar la foto.');
        //       });

        //     }).catch(e => {
        //       this.toast.danger('Error al sacar la foto.');
        //     });

        //   }, (error) => {
        //     this.toast.danger('Error al sacar la foto.');
        //   });
        // }, (err) => {
        //   this.toast.danger('Error al sacar la foto.');
        // });
    }

    loading: any = null;
    showLoader() {
        this.loading = this.loadingCtrl.create({
            content: 'Actualizando foto...'
        });
        this.loading.present();
    }

    openPhoto() {
        this.photoViewer.show(this.photo);
    }


}
