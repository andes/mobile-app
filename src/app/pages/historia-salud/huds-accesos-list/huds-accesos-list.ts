import { Component, OnInit } from '@angular/core';
import { HudsProvider } from 'src/providers/historia-salud/huds';
import { AuthProvider } from 'src/providers/auth/auth';
import { StorageService } from 'src/providers/storage-provider.service';
import { ToastProvider } from 'src/providers/toast';
import * as moment from 'moment/moment';

@Component({
    selector: 'app-huds-accesos-list',
    templateUrl: './huds-accesos-list.html',
    styleUrls: ['./huds-accesos-list.scss']
})
export class HudsAccesosListPage implements OnInit {
    accesos: any[] = [];
    familiar: any = false;
    loading = true;

    constructor(
        private hudsProvider: HudsProvider,
        private authProvider: AuthProvider,
        private storage: StorageService,
        private toastCtrl: ToastProvider
    ) {}

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            this.loadAccesos();
        });
    }

    loadAccesos() {
        let pacienteId;
        if (this.familiar) {
            pacienteId = this.familiar.id;
        } else {
            pacienteId = this.authProvider.user.pacientes[0].id;
        }

        const fechaDesde = moment().subtract(6, 'months').startOf('day').toDate();

        this.hudsProvider.getAccesos({
            paciente: pacienteId,
            fechaDesde: fechaDesde,
            limit: 100
        }).then((res: any[]) => {
            this.accesos = res || [];
            this.loading = false;
        }).catch((err) => {
            console.error('Error fetching HUDS accesses:', err);
            this.toastCtrl.danger('No se pudo cargar el historial de accesos.');
            this.loading = false;
        });
    }
}
