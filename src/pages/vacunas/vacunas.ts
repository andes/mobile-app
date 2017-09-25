import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'

import { VacunasProvider } from '../../providers/vacunas/vacunas';


/**
 * Generated class for the VacunasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
	selector: 'page-vacunas',
	templateUrl: 'vacunas.html',
})
export class VacunasPage {
	vacunas: any[] = null;

	constructor(
		public storage: Storage,
		public vacunasProvider: VacunasProvider,
		public navCtrl: NavController,
		public navParams: NavParams,
		public authProvider: AuthProvider) {

		this.getVacunas();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad VacunasPage');
	}

	getVacunas() {
		console.log(this.authProvider);
		let params = { dni: this.authProvider.user.documento };

		this.vacunasProvider.getCount(params).then(cantidad => {
			this.storage.get('cantidadVacunasLocal').then((cantidadVacunasLocal) => {

				// buscamos si hay vacunas almacenadas
				this.storage.get('vacunas').then((vacunasLocal) => {

					if (!vacunasLocal || cantidadVacunasLocal != cantidad) {
						if (!cantidadVacunasLocal || cantidadVacunasLocal != cantidad) {
							// almacenamos la cantidad de vacunas en el telefono
							this.storage.set('cantidadVacunasLocal', cantidad);
						}

						this.vacunasProvider.get(params).then((data: any[]) => {
							this.vacunas = data;
							this.storage.set('vacunas', data);
						});

					} else {
						this.vacunas = vacunasLocal;
					}
				});
			});

		});
	}
}
