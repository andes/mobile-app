import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DatePickerDirective  } from 'ion-datepicker';
import { AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { Usuario } from '../../../interfaces/usuario.interface';

// pages
import { RegistroUserDataPage } from '../user-data/user-data';
import { EscanerDniPage } from '../escaner-dni/escaner-dni';

// providers
import { AuthProvider } from '../../../providers/auth/auth';

@Component({
  selector: 'page-registro-personal-data',
  templateUrl: 'personal-data.html',
  providers: [DatePickerDirective]
})
export class RegistroPersonalDataPage {
  public usuario: Usuario;
  loading: any;
  mostrarMenu: boolean = false;
  fase: number = 1;
  formRegistro: FormGroup;
  submit: boolean = false;

  constructor(
    public storage: Storage,
    public authService: AuthProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public menu: MenuController,
    public datePicker: DatePickerDirective) {
    //this.menu.swipeEnable(false);

    this.formRegistro = formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      // telefono: ['', Validators.required],
      documento: ['', Validators.required],
      sexo: ['', Validators.required],
      genero: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      nacionalidad: ['', Validators.required],
    });

    this.formRegistro.patchValue({
      sexo: 'Femenino',
      nacionalidad: 'Argentina'
    });

    this.datePicker.valueChange.subscribe(
      (date) => {
        this.formRegistro.patchValue({
          fechaNacimiento: moment(date).format('DD/MM/YYYY')
        });
        // let element = document.getElementById('telefono');
        // if (element) {
        //   if (element.getElementsByTagName('input').length > 0) {
        //     element.getElementsByTagName('input')[0].focus();
        //   }
        // }
      });
  }

  ionViewDidLoad() {
    //
  }

  ionViewDidEnter() {
    this.storage.get('barscancode').then((value) => {
      this.storage.set('barscancode', null);
      if (value) {
        this.formRegistro.patchValue(value);
      }
    });
  }

  showCalendar() {
    this.datePicker.open();
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    value.fechaNacimiento = moment(value.fechaNacimiento, 'DD/MM/YYYY').format('YYYY-MM-DD');

    if (valid) {
      this.navCtrl.push(RegistroUserDataPage, { user: value });
    }
  }

  onSexoChange() {
    let element = document.getElementById('genero');
    if (element) {
      if (element.getElementsByTagName('input').length > 0) {
        element.getElementsByTagName('input')[0].focus();
      } else if (element.getElementsByTagName('button').length > 0) {
        element.getElementsByTagName('button')[0].focus();
      }
    }
  }

  onKeyPress($event, tag) {
    if ($event.keyCode == 13) {
      if (tag != 'fecha') {
        let element = document.getElementById(tag);
        if (element) {
          if (element.getElementsByTagName('input').length > 0) {
            element.getElementsByTagName('input')[0].focus();
          } else if (element.getElementsByTagName('button').length > 0) {
            element.getElementsByTagName('button')[0].focus();
          }
        }
      } else {
        this.showCalendar();
      }
    }
  }

}
