import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { TipoPrestacionService } from '../../services/tipoPrestacion-service';
import { TurnosProvider } from '../../providers/turnos';
import { TipoPrestacionServiceProvider } from '../../providers/tipo-prestacion-service/tipo-prestacion-service';
import * as moment from 'moment/moment';

@Component({
  selector: 'page-turnos',
  templateUrl: 'turnos.html'
})
export class TurnosPage {
  mostrarMenu: boolean = true;
  esconderLogoutBtn: boolean = false;
  selectOptions: any = {};

  tipoPrestacion: any[];
  turnos: any[] = [];

  constructor(public tipoPrestacionService: TipoPrestacionServiceProvider, public navCtrl: NavController,
    public navParams: NavParams, public turnosProvider: TurnosProvider) {

    // this.getTipoPrestacion();

    this.selectOptions = {
      title: 'Tipo de Prestación',
      subTitle: 'Seleccione Tipo de Prestación',
      mode: 'md'
    };

    turnosProvider.get().then((data: any[]) => {
      data.forEach(item => item.horaInicio = moment(item.horaInicio).format('DD/MM/YYYY HH:MM'));
      this.turnos = data;
    });
  }
}
