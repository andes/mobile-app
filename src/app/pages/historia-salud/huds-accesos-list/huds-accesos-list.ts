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
    accesosFiltrados: any[] = [];
    familiar: any = false;
    loading = true;

    // Paginación
    private scrollParams: any = { skip: 0, limit: 15 };
    scrollEnd = false;
    private loadingAccesos = false;

    // Límites de fecha: máximo 6 meses hacia atrás
    readonly fechaMin: string = moment().subtract(6, 'months').startOf('day').format('YYYY-MM-DD');
    readonly fechaMax: string = moment().format('YYYY-MM-DD');

    // Filtros
    filtroFechaDesde: string = moment().subtract(1, 'months').startOf('day').format('YYYY-MM-DD');
    filtroFechaHasta: string = moment().format('YYYY-MM-DD');
    filtroMotivo = '';
    filtrosAbiertos = true;

    // Motivos únicos para el selector
    motivosDisponibles: string[] = [];

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
            this.initScroll();
            this.getAccesos();
        });
    }

    private initScroll() {
        this.scrollParams = {
            skip: 0,
            limit: 30
        };
        this.scrollEnd = false;
        this.accesos = [];
    }

    loadMore(event?) {
        if (this.scrollEnd) {
            if (event) { event.target.complete(); }
            return;
        }
        this.getAccesos(event);
    }

    onFechaChange() {
        this.initScroll();
        this.getAccesos();
    }

    getAccesos(event?) {
        if (this.loadingAccesos) { return; }

        let pacienteId;
        if (this.familiar) {
            pacienteId = this.familiar.id;
        } else {
            pacienteId = this.authProvider.user.pacientes[0].id;
        }

        if (this.scrollParams.skip === 0) {
            this.accesos = [];
        }

        this.loadingAccesos = true;

        const params: any = {
            paciente: pacienteId,
            fechaDesde: this.filtroFechaDesde || moment().subtract(6, 'months').startOf('day').format('YYYY-MM-DD'),
            ...this.scrollParams
        };

        if (this.filtroFechaHasta) {
            params.fechaHasta = this.filtroFechaHasta;
        }

        this.hudsProvider.getAccesos(params).then((res: any) => {
            const nuevos = Array.isArray(res) ? res : (res?.data || []);

            this.accesos = this.accesos.concat(nuevos);
            this.scrollParams.skip = this.accesos.length;

            if (!nuevos.length || nuevos.length < this.scrollParams.limit) {
                this.scrollEnd = true;
            }

            this.buildMotivosDisponibles();
            this.aplicarFiltros();
            this.loading = false;
            this.loadingAccesos = false;
            if (event) { event.target.complete(); }
        }).catch(() => {
            this.toastCtrl.danger('No se pudo cargar el historial de accesos.');
            this.loading = false;
            this.loadingAccesos = false;
            if (event) { event.target.complete(); }
        });
    }

    buildMotivosDisponibles() {
        const set = new Set<string>();
        this.accesos.forEach(a => {
            if (a.motivosHuds) {
                if (Array.isArray(a.motivosHuds)) {
                    a.motivosHuds.forEach(m => { if (m) { set.add(m); } });
                } else if (typeof a.motivosHuds === 'string') {
                    set.add(a.motivosHuds);
                }
            }
            const label = a.labelPaciente || a.motivoAcceso;
            if (label) { set.add(label); }
        });
        this.motivosDisponibles = Array.from(set).sort();
    }

    aplicarFiltros() {
        if (!this.filtroFechaDesde && !this.filtroFechaHasta) {
            this.accesosFiltrados = [];
            return;
        }

        let resultado = [...this.accesos];

        const hasta = this.filtroFechaHasta
            ? moment(this.filtroFechaHasta).endOf('day')
            : moment().endOf('day');

        const desde = this.filtroFechaDesde
            ? moment(this.filtroFechaDesde).startOf('day')
            : moment().subtract(6, 'months').startOf('day');

        resultado = resultado.filter(a => {
            const fecha = moment(a.fecha);
            return fecha.isSameOrAfter(desde) && fecha.isSameOrBefore(hasta);
        });

        if (this.filtroMotivo) {
            resultado = resultado.filter(a => {
                const label = a.labelPaciente || a.motivoAcceso;
                if (label === this.filtroMotivo) { return true; }
                if (a.motivosHuds) {
                    if (Array.isArray(a.motivosHuds)) {
                        return a.motivosHuds.includes(this.filtroMotivo);
                    }
                    return a.motivosHuds === this.filtroMotivo;
                }
                return false;
            });
        }

        this.accesosFiltrados = resultado;
    }

    limpiarFiltros() {
        this.filtroFechaDesde = '';
        this.filtroFechaHasta = '';
        this.filtroMotivo = '';
        this.accesosFiltrados = [];
    }

    get hayFiltrosActivos(): boolean {
        return !!(this.filtroFechaDesde || this.filtroFechaHasta || this.filtroMotivo);
    }
}
