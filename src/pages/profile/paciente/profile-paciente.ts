import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import * as moment from 'moment';

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


      this.telefonos = paciente.contacto.filter(item => item.tipo != 'email');
      this.emails = paciente.contacto.filter(item => item.tipo == 'email');

      console.log(this.emails);
      this.telefonos.push({ tipo: 'celular', valor: '' });
      this.emails.push({ tipo: 'email', valor: '' });

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
    console.log(JSON.stringify(this.telefonos));
    this.telefonos.splice(-1, 1);
    this.emails.splice(-1, 1);
    console.log(JSON.stringify(this.telefonos));

    this.contactos = [...this.telefonos, ...this.emails];
    console.log(this.contactos);
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
            console.log(contacto);
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

}
