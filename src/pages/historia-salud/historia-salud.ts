import { CategoriasProvider } from './../../providers/historia-salud/categorias';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastProvider } from '../../providers/toast';
import { DetalleCategoriaPage } from './categorias/detalle-categoria';

@Component({
    selector: 'historia-salud',
    templateUrl: 'historia-salud.html',
})

export class HistoriaDeSaludPage {

    public categorias = [];

    constructor(
        public navCtrl: NavController,
        public toastCtrl: ToastProvider,
        public categoriasProvider: CategoriasProvider
    ) {

    }

    ionViewDidLoad() {
        this.categoriasProvider.get({}).then(async (categorias: any) => {
            this.categorias = categorias;
        }).catch(error => {
            if (error) {
                this.toastCtrl.danger('Ha ocurrido un error al obtener las categorías.');
            }
        });
    }

    verCategoria(categoria) {
        this.navCtrl.push(DetalleCategoriaPage, { categoria: categoria });
    }
}
