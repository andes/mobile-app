import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteProvider } from 'src/providers/paciente';
import { ToastProvider } from 'src/providers/toast';

@Component({
    selector: 'app-edit-alias',
    templateUrl: './edit-alias.page.html',
    styleUrls: ['../profile-paciente.scss'],
})
export class EditAliasPage implements OnInit {
    nombreAutopercibido: any;
    pacienteId: any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pacienteProvider: PacienteProvider,
        private toast: ToastProvider,


    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.nombreAutopercibido = params.alias;
            this.pacienteId = params.pacienteId;
        });
    }

    guardar() {
        const data = { alias: this.nombreAutopercibido };
        this.pacienteProvider.update(this.pacienteId, data);
        const compro = this.pacienteProvider.get(this.pacienteId)
            .then((result) => {
                if ((this.nombreAutopercibido as String).toUpperCase() === (((result as any).alias) as String)) {
                    this.toast.success('Los datos se guardaron correctamente.');
                } else {
                    this.toast.danger('Los datos no se guardaron correctamente.');
                }
            })
            .catch((error) => {
                this.toast.danger('Los datos no se guardaron correctamente');
            });
        this.router.navigate(['profile/view-profile/profile-paciente']);

    }
    cancelar() { }
}
