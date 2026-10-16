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
    private busquedaActual = 0;

    // Límites de fecha: máximo 6 meses hacia atrás
    readonly fechaMin: string = moment().subtract(6, 'months').startOf('day').format('YYYY-MM-DD');
    readonly fechaMax: string = moment().format('YYYY-MM-DD');

    // Filtros
    filtroFechaDesde: string = moment().subtract(1, 'months').startOf('day').format('YYYY-MM-DD');
    filtroFechaHasta: string = moment().format('YYYY-MM-DD');
    filtroMotivo = '';
    filtroUsuario = '';
    filtrosAbiertos = true;

    // Motivos únicos para el selector
    motivosDisponibles: string[] = [];

    usuariosDisponibles: { id: string; nombre: string }[] = [];

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
            this.buscarAccesos();
        });
    }

    onFechaChange() {
        this.buscarAccesos();
    }

    private buscarAccesos() {
        this.busquedaActual++;
        this.scrollParams = {
            skip: 0,
            limit: 30
        };
        this.scrollEnd = false;
        this.accesos = [];
        this.getAccesos(this.busquedaActual);
    }

    private getAccesos(busqueda: number) {
        const params: any = {
            paciente: this.familiar ? this.familiar.id : this.authProvider.user.pacientes[0].id,
            fechaDesde: this.filtroFechaDesde || this.fechaMin,
            ...this.scrollParams
        };

        if (this.filtroFechaHasta) {
            params.fechaHasta = this.filtroFechaHasta;
        }

        this.hudsProvider.getAccesos(params).then((res: any) => {
            if (busqueda !== this.busquedaActual) { return; }
            const nuevos = Array.isArray(res) ? res : (res?.data || []);

            this.accesos = this.accesos.concat(nuevos);
            this.scrollParams.skip = this.accesos.length;

            // La API devuelve los accesos del más reciente al más antiguo
            const ultimo = nuevos[nuevos.length - 1];
            if (nuevos.length < this.scrollParams.limit || moment(ultimo.fecha).isBefore(this.fechaDesdeFiltro())) {
                this.scrollEnd = true;
            }

            this.buildMotivosDisponibles();
            this.buildUsuariosDisponibles();
            this.aplicarFiltros();
            this.loading = false;

            if (!this.scrollEnd) {
                this.getAccesos(busqueda);
            }
        }).catch(() => {
            if (busqueda !== this.busquedaActual) { return; }
            this.toastCtrl.danger('No se pudo cargar el historial de accesos.');
            this.scrollEnd = true;
            this.loading = false;
        });
    }

    private fechaDesdeFiltro() {
        return moment(this.filtroFechaDesde || this.fechaMin).startOf('day');
    }

    private accesosDelRango() {
        const desde = this.fechaDesdeFiltro();
        const hasta = this.filtroFechaHasta
            ? moment(this.filtroFechaHasta).endOf('day')
            : moment().endOf('day');

        return this.accesos.filter(a => {
            const fecha = moment(a.fecha);
            return fecha.isSameOrAfter(desde) && fecha.isSameOrBefore(hasta);
        });
    }

    buildMotivosDisponibles() {
        const set = new Set<string>();
        this.accesosDelRango().forEach(a => {
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

    buildUsuariosDisponibles() {
        const usuarios = new Map<string, string>();
        this.accesosDelRango().forEach(a => {
            if (a.usuario?.id) {
                usuarios.set(a.usuario.id, this.nombreUsuario(a.usuario));
            }
        });
        this.usuariosDisponibles = Array.from(usuarios, ([id, nombre]) => ({ id, nombre }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    nombreUsuario(usuario: any): string {
        const nombre = usuario?.nombre || usuario?.nombreCompleto || 'Usuario del sistema';
        return usuario?.apellido ? `${usuario.apellido}, ${nombre}` : nombre;
    }

    aplicarFiltros() {
        if (!this.filtroFechaDesde && !this.filtroFechaHasta) {
            this.accesosFiltrados = [];
            return;
        }

        let resultado = this.accesosDelRango();

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

        if (this.filtroUsuario) {
            resultado = resultado.filter(a => a.usuario?.id === this.filtroUsuario);
        }

        this.accesosFiltrados = resultado;
    }

    limpiarFiltros() {
        this.busquedaActual++;
        this.scrollEnd = true;
        this.filtroFechaDesde = '';
        this.filtroFechaHasta = '';
        this.filtroMotivo = '';
        this.filtroUsuario = '';
        this.accesosFiltrados = [];
    }

    get hayFiltrosActivos(): boolean {
        return !!(this.filtroFechaDesde || this.filtroFechaHasta || this.filtroMotivo || this.filtroUsuario);
    }
}
