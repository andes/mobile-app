import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { DatePicker } from 'ionic2-date-picker/ionic2-date-picker';
import { DatePickerDirective } from 'ion-datepicker';
import { AlertController } from 'ionic-angular';
import * as moment from 'moment';

// pages
import { RegistroUserDataPage } from '../user-data/user-data';

// providers
import { AuthProvider } from '../../../providers/auth/auth';
import { DeviceProvider } from '../../../providers/auth/device';
import { ToastProvider } from '../../../providers/toast';

@Component({
  selector: 'page-registro-personal-data',
  templateUrl: 'personal-data.html',
  providers: [DatePickerDirective]
})
export class RegistroPersonalDataPage {
  loading: any;
  fase = 1;
  formRegistro: FormGroup;
  submit = false;

  email: string;
  code: string;

  constructor(
    public storage: Storage,
    public authService: AuthProvider,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public menu: MenuController,
    public datePicker: DatePickerDirective,
    public deviceProvider: DeviceProvider,
    private toastCtrl: ToastProvider) {
    // this.menu.swipeEnable(false);

    this.formRegistro = formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],

      // Datos del viejo registro

      // telefono: ['', Validators.required],
      // genero: ['', Validators.required],
      // nacionalidad: ['', Validators.required],
      // password: ['', Validators.required],
      // confirmarPassword: ['', Validators.required],
    } ,  {
      // validator: PasswordValidation.MatchPassword
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
      });

      this.email = this.navParams.get('email');
      this.code = this.navParams.get('code');
  }

  ionViewDidLoad() {
    this.datePicker.localeStrings = {
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    }

    this.datePicker.cancelText = 'Cancelar';
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

    let data = {
      nombre: value.nombre,
      apellido: value.apellido,
      fechaNacimiento: value.fechaNacimiento,
      sexo: value.sexo.toLowerCase(),
      documento: value.documento
    };

    this.authService.validarAccount(this.email, this.code, data).then(() => {
      this.navCtrl.push(RegistroUserDataPage, {code: this.code, email: this.email, dataMpi: data  });
    }).catch(() => {
      this.toastCtrl.danger('VERIFIQUE SUS DATOS');
    });
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
    if ($event.keyCode === 13) {
      if (tag !== 'fecha') {
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
