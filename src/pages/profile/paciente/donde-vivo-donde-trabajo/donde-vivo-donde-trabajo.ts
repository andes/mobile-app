import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

import { GoogleMapsProvider } from '../../../../providers/google-maps/google-maps';
import { PacienteProvider } from '../../../../providers/paciente';
import { ConstanteProvider } from '../../../../providers/constantes';
import { ToastProvider } from '../../../../providers/toast';

declare var google;

//@IonicPage()
@Component({
	selector: 'page-donde-vivo-donde-trabajo',
	templateUrl: 'donde-vivo-donde-trabajo.html',
})
export class DondeVivoDondeTrabajoPage {

	@ViewChild('map') mapElement: ElementRef;
	@ViewChild('pleaseConnect') pleaseConnect: ElementRef;

	paciente: any;
	mapObject: any;

	provinciaSelect: any;
	localidadSelect: any;
	calle: string = '';

	provincias: any = [];
	localidades: any = [];

	direccionReverse: string = '';

	direccion: any = {};

  private tipo: string;
  private ranking: number;
  private timeoutHandle: number;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public platform: Platform,
		public toast: ToastProvider,
		public mapsProvider: GoogleMapsProvider,
		public assetProvider: ConstanteProvider,
		public pacienteProvider: PacienteProvider,
		private nativeGeocoder: NativeGeocoder
	) {
	}

	ionViewDidLoad() {
    this.tipo = this.navParams.get("tipo");
    if (this.tipo == 'Donde vivo') {
      this.ranking = 0;
    } else if (this.tipo == 'Donde trabajo') {
      this.ranking = 1;
    }

		Promise.all([
			this.platform.ready(),
			this.mapsProvider.onInit,
			this.assetProvider.provincias()
		]).then(data => {

			// obtenemos el paciente
			this.paciente = this.pacienteProvider.paciente;

			// provincias para el select
			this.provincias = data[2];

			// buscamos la direccion del paciente
			if (this.paciente.direccion.length > 0) {
				// buscamos la direccion con ranking = 0 que pertenece a donde vive el paciente
				this.direccion = this.paciente.direccion.find(dir => dir.ranking == this.ranking);

				if (this.direccion && this.direccion.ubicacion && this.direccion.ubicacion.provincia) {
          // cargamos la calle
          this.calle = this.direccion.valor;

					// buscamos la provincia para seleccionar la opcion del select
					this.provinciaSelect = this.provincias.find(item => item.nombre == this.direccion.ubicacion.provincia.nombre);

					this.assetProvider.localidades({ provincia: this.provinciaSelect.id }).then((data) => {
						// asignamos las localidades
						this.localidades = data;

						// buscamos la opcion seleccionada del select
						this.localidadSelect = this.localidades.find(item => item.nombre == this.direccion.ubicacion.localidad.nombre);

						this.direccionReverse = this.provinciaSelect.nombre + " " + this.localidadSelect.nombre + " " + this.calle;
					});
				}
			}

			// cargamos el mapa
			this.loadMap(this.direccion);
		}).catch((error: any) => { alert('fuck'); console.log(error); });

	}

	loadMap(direccion) {

		this.mapObject = this.mapsProvider.createMap(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);

		if (this.direccion && this.direccion.geoReferencia) {
			let marker = {
				latitude: this.direccion.geoReferencia[0],
				longitude: this.direccion.geoReferencia[1],
				title: this.tipo
			}

			this.mapObject.addMarker(marker, { draggable: true });

			//this.mapObject.setCenter({lat: marker.latitude, lnt: marker.longitude});
		} else {
			this.mapsProvider.getGeolocation().then((location) => {
				console.log(location);
				console.log(location.coords.latitude, location.coords.longitude);

				let marker = {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					title: this.tipo
				}

				this.mapObject.addMarker(marker, { draggable: true });

				//this.mapObject.setCenter({lat: marker.latitude, lnt: marker.longitude});
			});
		}

	}

	onChangeProvincia() {
		this.assetProvider.localidades({ provincia: this.provinciaSelect.id }).then((data) => { this.localidades = data });
		this.refreshMarker();
	}

	onChangeLocalidad() {
		this.refreshMarker();
	}

	onChangeDireccion() {
		if (this.timeoutHandle) {
			window.clearTimeout(this.timeoutHandle);
		}

		if (this.calle) {
			this.timeoutHandle = window.setTimeout(() => {
				this.timeoutHandle = null;

				let idTimeOut = this.timeoutHandle;
				this.refreshMarker();
			}, 500);
		}
	}

	refreshMarker() {
		this.direccionReverse = '';

		// seteamos provincia
		if (this.provinciaSelect && this.provinciaSelect.nombre) {
			this.direccionReverse += this.provinciaSelect.nombre;
		}

		// seteamos localidad
		if (this.localidadSelect && this.localidadSelect.nombre) {
			this.direccionReverse += ' ' + this.localidadSelect.nombre;
		}

		// seteamos direccion
		if (this.calle) {
			this.direccionReverse += ' ' + this.calle;
		}


		if (this.provinciaSelect && this.provinciaSelect.nombre
			&& this.localidadSelect && this.localidadSelect.nombre
			&& this.calle) {

			this.nativeGeocoder.forwardGeocode(this.direccionReverse).then((coordinates: NativeGeocoderForwardResult) => {
				// borramos los marcadores
				this.mapObject.deleteAllMarkers();

				let marker = {
					latitude: coordinates.latitude,
					longitude: coordinates.longitude,
					title: 'Donde vivo'
				};

				this.mapObject.addMarker(marker, { draggable: true });
				//this.mapObject.setCenter({lat: marker.latitude, lnt: marker.longitude});
			}).catch((error: any) => console.log(error));
		}
	}

	save() {

		if (this.localidadSelect && this.provinciaSelect && this.calle) {

			// obtenemos latitud y longitud del marker
			let latLng = this.mapObject.markers[this.mapObject.markers.length - 1].getPosition();

			this.direccion = {
				geoReferencia: [latLng.lat(), latLng.lng()],
				ranking: this.ranking,
				valor: this.calle,
				codigoPostal: this.localidadSelect.codigoPostal,
				ubicacion: {
					localidad: {
						nombre: this.localidadSelect.nombre
					},
					provincia: {
						nombre: this.provinciaSelect.nombre
					},
					pais: {
						nombre: this.provinciaSelect.pais.nombre
					}
				}
			}
		}

    debugger;

    let index = this.paciente.direccion.findIndex(dir => dir.ranking == this.ranking);

    // si existe lo reemplazamos
    if (index !== -1) {
      this.paciente.direccion[index] = this.direccion;
    }else {
    // si no existe lo agregamos sobre el array
      this.paciente.direccion.push(this.direccion);
    }

    let data = {
      op: 'updateDireccion',
      direccion: this.paciente.direccion
    };

		this.pacienteProvider.update(this.paciente.id, data).then(() => {
			this.toast.success('DATOS MODIFICADOS CORRECTAMENTE');
			this.navCtrl.pop();
		});

  }

  /*
  geolocalizar(tipo) {
    let stringLocation = this.provSelect.nombre + ' ' + this.localidadSelect.nombre + ' ' + this.direccion;

    this.nativeGeocoder.forwardGeocode(stringLocation).then((coordinates: NativeGeocoderForwardResult) => {
      this[tipo].geoReferencia = [coordinates.latitude, coordinates.longitude];


    }).catch((error: any) => console.log(error));
  }
  */
}
