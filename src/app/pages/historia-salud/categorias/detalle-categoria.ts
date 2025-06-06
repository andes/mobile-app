import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PacienteProvider } from 'src/providers/paciente';
import { AuthProvider } from 'src/providers/auth/auth';
import { ENV } from '@app/env';
import * as moment from 'moment/moment';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/providers/storage-provider.service';
import { Router } from '@angular/router';
import { DescargaArchivosProvider } from 'src/providers/library-services/descarga-archivos';
@Component({
    selector: 'app-detalle-categoria',
    templateUrl: 'detalle-categoria.html',
    styleUrls: ['detalle-categoria.scss']
})

export class DetalleCategoriaPage implements OnInit {
    familiar: any = false;
    public categoria;
    public registros;
    constructor(
        private authProvider: AuthProvider,
        private pacienteProvider: PacienteProvider,
        private route: ActivatedRoute,
        private alertCtrl: AlertController,
        private storage: StorageService,
        private router: Router,
        private descargaProvider: DescargaArchivosProvider
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.categoria = JSON.parse(params.categoria);
            this.storage.get('familiar').then((value) => {
                if (value) {
                    this.familiar = value;
                }
                if (this.authProvider.user) {
                    let pacienteId;
                    if (this.familiar) {
                        pacienteId = this.familiar.id;
                    } else {
                        pacienteId = this.authProvider.user.pacientes[0].id;
                    }
                    // Verifica si la busqueda es por prestacion o por registros
                    if (this.categoria.busquedaPor === 'registros') {
                        this.pacienteProvider.huds(pacienteId, this.categoria.expresionSnomed).then((registros: any[]) => {
                            this.registros = registros;
                        });
                    }
                    if (this.categoria.busquedaPor === 'prestaciones') {
                        this.pacienteProvider.prestaciones(pacienteId, this.categoria.expresionSnomed).then((registros: any[]) => {
                            this.registros = registros;
                        });
                    }
                    if (this.categoria.busquedaPor === 'cdas') {
                        this.pacienteProvider.cdas(pacienteId).then((registros: any[]) => {
                            this.registros = registros.filter(registro => (registro.prestacion.snomed.conceptId === this.categoria.expresionSnomed
                                || registro.prestacion.snomed.term === this.categoria.titulo));
                        });
                    }
                }
            });
        });
    }

    fecha(registro) {
        return moment(registro.fecha).format('DD [de] MMMM [del] YYYY');
    }

    tienePacs(registro) {
        const pacsUid = registro.metadata?.find(item => item.key === 'pacs-uid');
        return pacsUid ? true : false;
    }

    profesionalName(registro) {
        if (registro.solicitud.profesional) {
            return registro.solicitud.profesional.apellido + ' ' + registro.solicitud.profesional.nombre;
        } else {
            return 'Sin profesional';
        }
    }

    private getAdjunto(registro) {
        return registro.registro.registros.find(x => x.nombre === 'documento adjunto');
    }

    async descargarCategoria(registro) {
        let uri;
        let nombreArchivo;
        if (this.categoria.descargaAdjuntos && this.getAdjunto(registro)) {
            const elementoAdjuntos = this.getAdjunto(registro);
            if (elementoAdjuntos && elementoAdjuntos.valor.documentos[0]) {
                uri = ENV.API_URL + 'modules/rup/store/' +
                    elementoAdjuntos.valor.documentos[0].id + '?token=' + this.authProvider.token;
                nombreArchivo = `${elementoAdjuntos.valor.documentos[0].id}.${elementoAdjuntos.valor.documentos[0].ext}`;
            } else {
                const alert = await this.alertCtrl.create({
                    header: 'Sin adjuntos',
                    subHeader: 'No existe un archivo asociado',
                    buttons: ['Cerrar']
                });
                await alert.present();
                this.router.navigate(['historia-salud']);
            }
        } else {
            const tipo = 'pdf';
            let pdfURL = 'modules/descargas/rup';
            let parametros;
            if (this.categoria.busquedaPor === 'registros') {
                const id = registro.registro && registro.registro._id ? registro.registro._id : registro.registro.id;
                parametros = `${registro.idPrestacion}/${id}`;
                nombreArchivo = `${registro.registro.concepto.term}.${tipo}`;

            }
            if (this.categoria.busquedaPor === 'prestaciones') {
                parametros = `${registro.id}/`;
                nombreArchivo = `${registro.solicitud.tipoPrestacion.term}.${tipo}`;
            }
            if (this.categoria.busquedaPor === 'cdas') {
                pdfURL = 'modules/cda';
                parametros = `${registro.adjuntos[0]}`;
            }
            uri = ENV.API_URL + `${pdfURL}/${parametros}` +
                '?token=' + this.authProvider.token;
        }
        this.descargaProvider.descargarArchivo(uri, nombreArchivo);
    }

    async abrirImagen(registro) {
        if (this.tienePacs(registro) && this.categoria.busquedaPor === 'prestaciones') {
            const uri = ENV.API_URL + `modules/rup/prestaciones/${registro.id}/pacs` +
                '?token=' + this.authProvider.token;
            window.open(uri);
        }
    }
}
