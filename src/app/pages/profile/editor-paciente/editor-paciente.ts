import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, LoadingController, MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthProvider } from 'src/providers/auth/auth';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from 'src/providers/paciente';
import { ToastProvider } from 'src/providers/toast';

@Component({
    selector: 'app-editor-paciente',
    templateUrl: 'editor-paciente.html',
})
export class EditorPacientePage implements OnInit {
    public paciente: any;
    loading: any;
    fase = 1;
    formRegistro: FormGroup;
    submit = false;

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
        public toast: ToastProvider) {
    }

    ngOnInit(): void {
        this.paciente = this.pacienteProvider.paciente;
        this.formRegistro = this.formBuilder.group({
            nombre: ['', Validators.required],
            apellido: ['', Validators.required],
            // telefono: ['', Validators.required],
            // documento: ['', Validators.required],
            sexo: ['', Validators.required],
            // genero: ['', Validators.required],
            // fechaNacimiento: ['', Validators.required],
            nacionalidad: ['', Validators.required],
        });
        this.formRegistro.patchValue({
            nombre: this.paciente.nombre,
            apellido: this.paciente.apellido,
            sexo: this.paciente.sexo,
            nacionalidad: this.paciente.nacionalidad
        });
    }

    onEdit() {
        let notas = JSON.stringify(this.formRegistro.value);
        let data = {
            reportarError: true,
            notas
        }
        this.pacienteProvider.update(this.paciente.id, data).then(() => {
            this.navCtrl.pop();
            this.toast.success('SOLICITUD ENVIADA CON EXITO!');
        }).catch(() => {
            this.toast.danger('ERROR AL MANDAR LA SOLICITUD');
        });
    }
}
