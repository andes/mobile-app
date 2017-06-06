import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { TipoPrestacionService } from '../../services/tipoPrestacion-service';

import { TipoPrestacionServiceProvider } from '../../providers/tipo-prestacion-service/tipo-prestacion-service';

import { Sim } from '@ionic-native/sim';

@Component({
  selector: 'page-turnos',
  templateUrl: 'turnos.html'
})
export class TurnosPage  { 

  selectOptions: any = {};

  tipoPrestacion: any[];

  constructor(private sim: Sim, public tipoPrestacionService: TipoPrestacionServiceProvider, public navCtrl: NavController, public navParams: NavParams, ) {    

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

  verSim() {
    this.sim.getSimInfo().then(
      (info) => alert(info.phoneNumber  + ' - ' + info.activeSubscriptionInfoCount),
  // (info) => console.log('Sim info: ', info),
  // (err) => console.log('Unable to get sim info: ', err)
);

this.sim.hasReadPermission().then(
  // (info) => console.log('Has permission: ', info)
);

this.sim.requestReadPermission().then(
  // () => console.log('Permission granted'),
  // () => console.log('Permission denied')
);
  }
}
