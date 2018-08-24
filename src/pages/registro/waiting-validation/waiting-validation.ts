import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, NavController } from 'ionic-angular';
import { DatePickerDirective } from 'ion-datepicker';
import * as moment from 'moment';

// providers
import { AuthProvider } from '../../../providers/auth/auth';

// pages
import { VerificaCodigoPage } from '../verifica-codigo/verifica-codigo';

@Component({
  selector: 'page-waiting-validation',
  templateUrl: 'waiting-validation.html',
  providers: [DatePickerDirective]
})
export class WaitingValidationPage {
  usuario: any;
  formRegistro: FormGroup;
  expand: Boolean = false;

  constructor(
    public authService: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public datePicker: DatePickerDirective) {

    this.usuario = this.navParams.get('user');
    this.formRegistro = formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
    });
    // this.usuario.sexo = this.usuario.sexo.toLowerCase();

    this.formRegistro.patchValue(this.usuario);

    this.datePicker.valueChange.subscribe(
      (date) => {
        this.formRegistro.patchValue({
          fechaNacimiento: moment(date).format('DD-MM-YYYY')
        });
      });

  }

  showCalendar() {
    this.datePicker.open();
  }

  ionViewDidLoad() {
    //
  }

  onBack() {
    this.navCtrl.pop();
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      value.email = this.usuario.email;
      this.authService.updateAccount(value).then((data: any) => {
        if (data.valid) {
          this.navCtrl.setRoot(VerificaCodigoPage);
        } else {
          this.expand = false;
        }
      }).catch(() => {
        // console.log('error');
      })
      // this.navCtrl.push(RegistroUserDataPage, { user: value });
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
