import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstanteProvider } from 'src/providers/constantes';
import { PacienteProvider } from 'src/providers/paciente';
import { ToastProvider } from 'src/providers/toast';

@Component({
    selector: 'app-edit-genero',
    templateUrl: './edit-genero.page.html',
    styleUrls: ['../../profile-paciente.scss'],
})
export class EditGeneroPage implements OnInit {

    nombreAutopercibido: any;
    pacienteId: any;
    genero;
    generos;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pacienteProvider: PacienteProvider,
        private toast: ToastProvider,
        private constantesService: ConstanteProvider


    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.genero = params.genero;
            this.pacienteId = params.pacienteId;
        });
        this.constantesService.getGeneros().then(generos => {
            this.generos = generos;
        });
    }

    guardar() {
        if (typeof this.genero !== 'string') {
            const data = { genero: this.genero.key };
            this.pacienteProvider.update(this.pacienteId, data);
            this.pacienteProvider.get(this.pacienteId)
                .then((result) => {
                    if ((this.genero.key) === (((result as any).genero))) {
                        this.toast.success('Los datos se guardaron correctamente.');
                    } else {
                        this.toast.danger('Los datos no se guardaron correctamente.');
                    }
                })
                .catch((error) => {
                    this.toast.danger('Los datos no se guardaron correctamente.');
                });
        }
        this.router.navigate(['profile/view-profile/profile-paciente']);
    }

}
