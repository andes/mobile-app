import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { Usuario } from '../../../interfaces/usuario.interface';
import { RegistroUserDataPage } from '../user-data/user-data';
import { EscanerDniPage } from '../../escaner-dni/escaner-dni';
import { Storage } from '@ionic/storage';
// import { DatabaseProvider } from '../../providers/database/database';
/**
 * Generated class for the RegistroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-registro-personal-data',
  templateUrl: 'personal-data.html',
})
export class RegistroPersonalDataPage {
  public usuario: Usuario;
  loading: any;
  mostrarMenu: boolean = false;
  fase: number = 1;
  formRegistro: FormGroup;
  submit: boolean = false;

  constructor(public storage: Storage, public authService: AuthProvider, public loadingCtrl: LoadingController, public navCtrl: NavController,
    public navParams: NavParams, public alertCtrl: AlertController, public formBuilder: FormBuilder, public menu: MenuController) {
    //this.menu.swipeEnable(false);

    this.formRegistro = formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
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

  onSubmit({ value, valid }: { value: Usuario, valid: boolean }) {
    if (valid) {
      this.navCtrl.push(RegistroUserDataPage, { user: value });
    }
  }

  scanDNI() {
    this.navCtrl.push(EscanerDniPage);
  }

  onKeyPress($event, tag) {
    if ($event.keyCode == 13) {
      let element = document.getElementById(tag);
      if (element) {
        if (element.getElementsByTagName('input').length > 0) {
          element.getElementsByTagName('input')[0].focus();
        } else if (element.getElementsByTagName('button').length > 0) {
          element.getElementsByTagName('button')[0].focus();
        }
      }
    }
  }

}
