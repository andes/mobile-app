import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { EditorPacientePage } from '../editor-paciente/editor-paciente';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from '../../../providers/paciente';
import { ConstanteProvider } from '../../../providers/constantes';
import { ToastProvider } from '../../../providers/toast';
import * as moment from 'moment';

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
    'email',
    'celular',
    'fijo'
  ];

  reportarError: any;
  paciente: any;
  contactos: any[];
  direcciones: any[];

  provSelect: any;
  localidadSelect: any;
  direccion = '';

  provincias: any = [];
  localidades: any = [];

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
    public toast: ToastProvider) {
    //this.menu.swipeEnable(false);

  }

  fechaNacimiento() {
    return moment(this.paciente.fechaNacimiento).format('DD/MM/YYYY')
  }

  ionViewDidLoad() {
    let pacienteId = this.authService.user.pacientes[0].id;
    console.log('paciente id = ', pacienteId);
    this.pacienteProvider.get(pacienteId).then((paciente: any) => {
      this.paciente = paciente;
      this.contactos = paciente.contacto;
      this.direcciones = paciente.direccion;
      this.contactos.push({ tipo: 'celular', valor: '' });

      this.assetProvider.provincias().then((data) => {
        this.provincias = data
        if (this.paciente.direccion.length > 0) {
          let dir = this.paciente.direccion[0];

          let prov = this.provincias.find(item => item.nombre == dir.ubicacion.provincia.nombre);
          this.provSelect = prov;
          this.assetProvider.localidades({ provincia: this.provSelect.id }).then((data) => {
            this.localidades = data;
            this.localidadSelect = this.localidades.find(item => item.nombre == dir.ubicacion.localidad.nombre);
            this.direccion = dir.valor;
          });
        }

      });
    }).catch(() => {
      console.log("ERROR");
    });

  }

  ionViewDidEnter() {

  }

  onValorChange() {
    let last = this.contactos.length - 1;
    if (this.contactos[last].valor.length > 0) {
      this.contactos.push({ tipo: 'celular', valor: '' });
    } else if (this.contactos.length > 1 && this.contactos[last - 1].valor.length == 0) {
      this.contactos.pop();
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
    console.log(this.showPersonal, this.showContactos);
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
    this.contactos.splice(-1, 1)
    console.log(this.contactos);
    let data = {
      contacto: this.contactos,
      direccion
    };
    console.log(data);
    this.pacienteProvider.update(this.paciente.id, data).then(() => {
      this.toast.success('DATOS MODIFICADOS!');
    })

    console.log(direccion);


  }

  onChangeProvincia() {
    console.log(this.provSelect);
    this.assetProvider.localidades({ provincia: this.provSelect.id }).then((data) => { this.localidades = data });
  }

  onChangeLocalidad() {
    console.log(this.localidadSelect);
  }

}
