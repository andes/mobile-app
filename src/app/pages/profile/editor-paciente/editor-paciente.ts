import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
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
        private navCtrl: NavController,
        private formBuilder: FormBuilder,
        private pacienteProvider: PacienteProvider,
        private toast: ToastProvider) {
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
        const notas = JSON.stringify(this.formRegistro.value);
        const data = {
            reportarError: true,
            notas
        };
        this.pacienteProvider.update(this.paciente.id, data).then(() => {
            this.navCtrl.pop();
            this.toast.success('SOLICITUD ENVIADA CON EXITO!');
        }).catch(() => {
            this.toast.danger('ERROR AL MANDAR LA SOLICITUD');
        });
    }
}
