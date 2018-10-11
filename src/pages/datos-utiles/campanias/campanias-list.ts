import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// Pages
import { CampaniaDetallePage } from '../campanias/detalle/campania-detalle';

@Component({
    selector: 'page-campanias-list',
    templateUrl: 'campanias-list.html'
})
export class CampaniasListPage {
    campanias: any = [{
        titulo: 'Campaña lucha del cancer de mama',
        texto: 'Durante octubre, mes de la lucha contra el cáncer de mama, las mujeres de entre 50 y 70 años podrán realizarse mamografías de manera gratuita y sin turno previo.',
        imagen: '',
        icono: '',
        estado: 'vigente',
        periodo: {
            inicio: '01/10/2018',
            fin: '01/11/2018'
        }

    },
    {
        titulo: 'Campaña vacunación antigripal',
        texto: 'Durante septiembre, se realiza bla bla',
        imagen: '',
        icono: '',
        estado: 'vigente',
        periodo: {
            inicio: '01/11/2018',
            fin: '01/12/2018'
        }
    }]
    constructor(
        public navCtrl: NavController) {

    }

    verCampania(campania) {
        this.navCtrl.push(CampaniaDetallePage, { campania: campania });
    }

}
