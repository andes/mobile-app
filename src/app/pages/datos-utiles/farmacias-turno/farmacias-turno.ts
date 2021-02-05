import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
// providers
import { FarmaciasProvider } from '../../../../providers/farmacias';

@Component({
    selector: 'app-farmacias-turno',
    templateUrl: 'farmacias-turno.html'
})

export class FarmaciasTurnoPage implements OnInit {
    localidades: any[] = [];
    farmacias: any[] = [];
    localidadSelect: any;
    localidadName: any;
    loading = false;
    public familiar: any = false;


    constructor(
        private farmaciasCtrl: FarmaciasProvider,
        private storage: Storage) {
    }

    ngOnInit() {
        this.storage.get('familiar').then((value) => {
            if (value) {
                this.familiar = value;
            }
            this.getLocalidades();
        });
    }

    onSelectLocalidad() {
        this.turnos(this.localidadSelect);
        this.localidadName = this.localidades.find(item => item.localidadId === this.localidadSelect).nombre;
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
        const params = {
            localidad,
            desde: moment().format('YYYY-MM-DD'),
            hasta: moment().add(2, 'day').format('YYYY-MM-DD'),
        };
        if (moment().hour() < 8) {
            params.desde = moment().subtract(1, 'day').format('YYYY-MM-DD');
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

            const localidad = this.localidades.find(item => item.localidadId === 1);
            if (localidad) {
                this.localidadSelect = parseInt(localidad.localidadId, 10);
                this.localidadName = localidad.nombre;
                this.turnos(parseInt(localidad.localidadId, 10));
            }
        });
    }

}
