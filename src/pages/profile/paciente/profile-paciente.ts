import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { Base64 } from '@ionic-native/base64';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { DomSanitizer } from '@angular/platform-browser';

// pages
import { TurnosPage } from '../../turnos/turnos';

import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { EditorPacientePage } from '../editor-paciente/editor-paciente';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from '../../../providers/paciente';
import { ConstanteProvider } from '../../../providers/constantes';
import { ToastProvider } from '../../../providers/toast';

@IonicPage()
@Component({
  selector: 'page-profile-paciente',
  templateUrl: 'profile-paciente.html',
})
export class ProfilePacientePage {
  emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  phoneRegex = /^[1-3][0-9]{9}$/;

  mostrarMenu: boolean = true;
  showPersonal = false;
  showContactos = false;

  contactType = [
    'celular',
    'fijo'
  ];

  reportarError: any;
  paciente: any;
  contactos: any[];
  direcciones: any[];

  telefonos: any[];
  emails: any[];

  provSelect: any;
  localidadSelect: any;
  direccion = '';

  provincias: any = [];
  localidades: any = [];

  public photo: any;

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
		private sanitizer: DomSanitizer) {
    //this.menu.swipeEnable(false);

  }

  fechaNacimiento() {
    return moment(this.paciente.fechaNacimiento).format('DD/MM/YYYY')
  }

  ionViewDidLoad() {
    let pacienteId = this.authService.user.pacientes[0].id;
    this.pacienteProvider.get(pacienteId).then((paciente: any) => {
      this.paciente = paciente;
      this.contactos = paciente.contacto;
      this.direcciones = paciente.direccion;


      this.telefonos = paciente.contacto.filter(item => item.tipo != 'email');
      this.emails = paciente.contacto.filter(item => item.tipo == 'email');

      this.telefonos.push({ tipo: 'celular', valor: '' });
      this.emails.push({ tipo: 'email', valor: '' });

      this.assetProvider.provincias().then((data) => {
        this.provincias = data
        if (this.paciente.direccion.length > 0) {
          let dir = this.paciente.direccion[0];

          if (this.paciente.direccion[0] && this.paciente.direccion[0].ubicacion &&
						this.paciente.direccion[0].ubicacion.provincia) {

            let prov = this.provincias.find(item => item.nombre == dir.ubicacion.provincia.nombre);
              this.provSelect = prov;
              this.assetProvider.localidades({ provincia: this.provSelect.id }).then((data) => {
                this.localidades = data;
                this.localidadSelect = this.localidades.find(item => item.nombre == dir.ubicacion.localidad.nombre);
                this.direccion = dir.valor;
            });
          }
        }

      });
    }).catch(() => {
      console.log("ERROR");
    });

  }

  ionViewDidEnter() {

  }

  onInputChange(list, newType) {
    let last = list.length - 1;
    if (list[last].valor.length > 0) {
      list.push({ tipo: newType, valor: '' });
    } else if (list.length > 1 && list[last - 1].valor.length == 0) {
      list.pop();
    }
  }

  reportarChange() {
    // console.log('Cucumbers new state:' + this.reportarError);
  }

  tooglePersonales() {
    if (this.showPersonal) {
      this.showPersonal = false;
    } else {
      this.showPersonal = true;
      this.showContactos = false;
    }
  }

  toogleContactos() {
    if (this.showContactos) {
      this.showContactos = false;
    } else {
      this.showContactos = true;
      this.showPersonal = false;
    }
  }

  onEdit() {
    this.navCtrl.push(EditorPacientePage, { paciente: this.paciente });
  }

  onSave() {
    this.telefonos.splice(-1, 1);
    this.emails.splice(-1, 1);

    this.contactos = [...this.telefonos, ...this.emails];
    for (let i = 0; i < this.contactos.length - 1; i++) {
      let contacto = this.contactos[i];
      switch (contacto.tipo) {
        case 'email':
          if (!this.emailRegex.test(contacto.valor)) {
            this.toast.danger('EMAIL INVALIDO');
            return;
          }
          break;
        case 'fijo':
        case 'celular':
          if (!this.phoneRegex.test(contacto.valor)) {
            this.toast.danger('TELEFONO INVALIDO');
            return;
          }
          break;
      }
    }
    let direccion;
    if (this.localidadSelect && this.provSelect) {
      direccion = {
        valor: this.direccion,
        codigoPostal: this.localidadSelect.codigoPostal,
        ubicacion: {
          localidad: {
            // id: this.localidadSelect._id,
            nombre: this.localidadSelect.nombre
          },
          provincia: {
            // id: this.provSelect._id,
            nombre: this.provSelect.nombre
          },
          pais: {
            // id: this.provSelect.pais.id,
            nombre: this.provSelect.pais.nombre
          }
        }
      }
    }
    let data = {
      contacto: this.contactos,
      direccion
    };
    this.pacienteProvider.update(this.paciente.id, data).then(() => {
      this.toast.success('DATOS MODIFICADOS CORRECTAMENTE');
      this.navCtrl.setRoot(TurnosPage);

    })

  }

  onChangeProvincia() {
    this.assetProvider.localidades({ provincia: this.provSelect.id }).then((data) => { this.localidades = data });
  }

  onChangeLocalidad() {
    //
  }

  takePhoto() {
		let options = {
			quality: 10, // 80
			correctOrientation: true,
			destinationType: 2 // NATIVE_URI
		} as CameraOptions;

		// sacamos la foto
		this.camera.getPicture(options).then((imageData) => {

			// cropeamos la foto que sacamos
			this.cropService.crop(imageData, { quality: 75 }).then((imageCropped) => {

				// por ultimo hacemos un resize
				let optionsResize = {
					uri: imageCropped,
					folderName: 'andes',
					quality: 10, //70
					width: 600,
					height: 600
				} as ImageResizerOptions;

				this.imageResizer.resize(optionsResize).then((filePath: string) => {
          // transformamos la foto en base64 para poder guardar en la base
					this.base64.encodeFile(filePath).then((base64File: string) => {
            // debemos sanatizar si o si el archivo en base64 generado para
            // poder mostrarlo en el browser y evitar ataques xss o lo que sea
            // Ref: https://angular.io/guide/security#xss
            this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(base64File);
            console.log(this.paciente);
            //alert(this.pacienteProvider.paciente.id);
            //alert(this.pacienteProvider.paciente._id);
            this.pacienteProvider.update(this.paciente.id, { fotoMobile: this.photo }).then(() => {
              this.toast.success('Foto de perfil actualizada');
            }, error => {
                console.log(error);
            });
					}, (err) => {
						console.log(err);
					});

				}).catch(e => console.log(e));

			}, (error) => {
			});
		}, (err) => {
		});
	}

	openPhoto() {
		this.photoViewer.show(this.photo);
	}

	convertToBase64(url, outputFormat) {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.crossOrigin = 'Anonymous';
			img.onload = function () {
				debugger;
				let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
					ctx = canvas.getContext('2d'),
					dataURL;
				canvas.height = img.height;
				canvas.width = img.width;
				ctx.drawImage(img, 0, 0);
				dataURL = canvas.toDataURL(outputFormat);
				canvas = null;
				resolve(dataURL);
			};
			img.src = url;
		});
	}

}
