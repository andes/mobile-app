import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { TipoPrestacionService } from '../../services/tipoPrestacion-service';

import { TipoPrestacionServiceProvider } from '../../providers/tipo-prestacion-service/tipo-prestacion-service';

@Component({
  selector: 'page-turnos',
  templateUrl: 'turnos.html'
})
export class TurnosPage {

  selectOptions: any = {};

  tipoPrestacion: any[];

  constructor(public tipoPrestacionService: TipoPrestacionServiceProvider, public navCtrl: NavController,
    public navParams: NavParams, ) {

    this.getTipoPrestacion();

    this.selectOptions = {
      title: 'Tipo de Prestación',
      subTitle: 'Seleccione Tipo de Prestación',
      mode: 'md'
    };
  }

  getTipoPrestacion() {
    this.tipoPrestacionService.getTipoPrestacion().subscribe(
      resultado => { debugger; this.tipoPrestacion = resultado; });
  }
}
