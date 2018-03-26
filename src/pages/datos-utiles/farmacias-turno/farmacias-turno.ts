import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';

// pages

// providers
import { AuthProvider } from '../../../providers/auth/auth';
import { FarmaciasProvider } from '../../../providers/farmacias';

@Component({
    selector: 'page-farmacias-turno',
    templateUrl: 'farmacias-turno.html'
})
export class FarmaciasTurnoPage {
    localidades: any[] = [];
    farmacias: any[] = [];
    localidadSelect: any;
    localidadName: any;
    loading = false;

    constructor(
        public authService: AuthProvider,
        public navCtrl: NavController,
        public farmaciasCtrl: FarmaciasProvider) {

        this.getLocalidades();
    }

    onSelectLocalidad() {
        this.turnos(this.localidadSelect);
        this.localidadName = this.localidades.find(item => item.localidadId == this.localidadSelect).nombre;
    }

    formatFecha(f) {
        return moment(f.fecha).format('DD/MM');
    }

    toMap(farmacia) {
        window.open('geo:?q=' + farmacia.latitud + ',' + farmacia.longitud);
    }

    call(farmacia) {
        window.open('tel:' + farmacia.telefono);
    }

    turnos(localidad) {
        this.loading = true;
        let params = {
            localidad,
            desde: moment().format('YYYY-MM-DD'),
            hasta: moment().add(2, 'day').format('YYYY-MM-DD'),
        };
        if (moment().hour() < 8) {
            params.desde = moment().subtract(1, 'day').format('YYYY-MM-DD')
        }
        this.farmaciasCtrl.getTurnos(params).then((data: any[]) => {
            this.farmacias = data;
            this.loading = false;
        });
    }

    getLocalidades() {
        this.loading = true;
        this.farmaciasCtrl.getLocalidades().then((data: any[]) => {
            this.loading = false;
            this.localidades = data;

            let l = this.localidades.find(item => item.localidadId == 1);
            if (l) {
                this.localidadSelect = parseInt(l.localidadId);
                this.localidadName = l.nombre;
                this.turnos(parseInt(l.localidadId));
            }
        });
    }

}
