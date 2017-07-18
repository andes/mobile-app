import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { Usuario } from '../../../interfaces/usuario.interface';
import { RegistroUserDataPage } from '../user-data/user-data';
import { EscanerDniPage } from '../../escaner-dni/escaner-dni';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from '../../../providers/paciente';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-profile-paciente',
  templateUrl: 'profile-paciente.html',
})
export class ProfilePacientePage {
  public usuario: Usuario;
  loading: any;
  esconderLogoutBtn: boolean = true;
  mostrarMenu: boolean = true;
  fase: number = 1;
  formRegistro: FormGroup;
  submit: boolean = false;


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

  constructor(
    public storage: Storage,
    public authService: AuthProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public menu: MenuController,
    public pacienteProvider: PacienteProvider) {
    //this.menu.swipeEnable(false);

    this.formRegistro = formBuilder.group({
      /*
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      documento: ['', Validators.required],
      sexo: ['', Validators.required],
      genero: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      */
    });

  }

  fechaNacimiento() {
    return moment(this.paciente.fechaNacimiento).format('DD/MM/YYYY')
  }

  ionViewDidLoad() {
    let pacienteId = this.authService.user.pacientes[0].id;
    console.log('paciente id = ', pacienteId);
    this.pacienteProvider.get(pacienteId).then((paciente: any) => {
      console.log(paciente);
      this.paciente = paciente;
      this.contactos = paciente.contacto;
      this.direcciones = paciente.direccion;

      this.contactos.push({ tipo: 'celular', valor: '' });

    }).catch(() => {
      console.log("ERROR");
    });
  }

  ionViewDidEnter() {

  }

  onSubmit({ value, valid }: { value: Usuario, valid: boolean }) {
    if (valid) {

    }
  }

  onValorChange() {
    console.log("ejecuto");
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
}
