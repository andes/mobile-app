import { NavController, NavParams } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { FtpProvider } from 'src/providers/ftp';
import { FormTerapeuticoDetallePage } from './form-terapeutico-detalle';

@Component({
    selector: 'app-arbol-item',
    templateUrl: 'arbolItem.html',
})

export class ArbolItemPage implements OnInit {
    private indices;
    private titulo;
    private padres: any[];
    private hijos: any[];


    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public ftp: FtpProvider,
    ) {

    }

    esHoja () {
        return !this.indice.arbol || this.indice.arbol.length === 0;
    }

    @Input()indice: any;
    @Input() deep: Number;

    ngOnInit() {

    }

    buscarHijos() {
        this.ftp.get({ tree: 1, idpadre: this.indice._id }).then((data: any) => {
             this.hijos = data;
        });
    }

    verDetalle() {
            const params = {
                item: this.indice,
                idpadres: this.padres
            };

            // this.navCtrl.push(FormTerapeuticoDetallePage, params);
    }

}
