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
  mostrarMenu: boolean = false;
  localidades: any[] = [];
  farmacias: any[] = [];
  localidadSelect: any;
  localidadName: any;

  constructor(
    public authService: AuthProvider,
    public navCtrl: NavController,
    public farmaciasCtrl: FarmaciasProvider) {

    this.getLocalidades();
  }

  onSelectLocalidad() {
    console.log(this.localidadSelect);
    this.turnos(this.localidadSelect);
    this.localidadName = this.localidades.find(item => item.localidadId == this.localidadSelect).nombre;
  }

  formatFecha(f) {
    return moment(f.fecha).format('DD/MM');
  }

  toMap(farmacia) {
    window.open('geo:?q=' + farmacia.direccion + ',' + this.localidadName + ', Neuquen');
  }

  call(farmacia) {
    window.open('tel:' + farmacia.telefono);
  }

  turnos(localidad) {
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
    });
  }

  getLocalidades() {
    this.farmaciasCtrl.getLocalidades().then((data: any[]) => {
      this.localidades = data;
      this.localidadSelect = parseInt(data[0].localidadId);
      this.localidadName = data[0].nombre;
      this.turnos(parseInt(data[0].localidadId));
    });
  }

}
