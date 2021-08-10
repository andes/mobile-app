import { Component, OnInit } from '@angular/core';
import { AuthProvider } from 'src/providers/auth/auth';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from 'src/providers/paciente';

@Component({
    selector: 'app-vacunas-detalle',
    templateUrl: './vacunas-detalle.page.html',
    styleUrls: ['./vacunas-detalle.page.scss'],
})
export class VacunasDetallePage implements OnInit {
    public vacuna;

    public paciente;
    public familiar: any = false;
    inProgress = false;

    constructor(
        public authService: AuthProvider,
        private route: ActivatedRoute,
        private storage: Storage,
        private pacienteProvider: PacienteProvider) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.vacuna = JSON.parse(params.vacuna);
        });

        this.inProgress = true;
        this.storage.get('familiar').then((value) => {
            let pacienteId;
            if (value) {
                pacienteId = value.id;
            } else {
                if (this.authService.user.pacientes && this.authService.user.pacientes[0]) {
                    pacienteId = this.authService.user.pacientes[0].id;
                }
            }
            this.pacienteProvider.get(pacienteId).then((paciente: any) => {
                this.inProgress = false;
                this.paciente = paciente;
            }).catch(() => {
                this.inProgress = false;
            });
        });
    }
}
