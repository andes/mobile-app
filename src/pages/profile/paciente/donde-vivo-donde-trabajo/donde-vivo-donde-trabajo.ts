import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Diagnostic } from '@ionic-native/diagnostic';

import { PacienteProvider } from '../../../../providers/paciente';
import { ConstanteProvider } from '../../../../providers/constantes';
import { ToastProvider } from '../../../../providers/toast';
import { Device } from '@ionic-native/device';


declare var google;

//@IonicPage()
@Component({
    selector: 'page-donde-vivo-donde-trabajo',
    templateUrl: 'donde-vivo-donde-trabajo.html',
})
export class DondeVivoDondeTrabajoPage {

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

    public _direccion = '';
    public _localidad = '';
    public _provincia = '';
    public inProgress = false;
    public paciente: any;
    //   mapObject: any;

    //   provinciaSelect: any;
    //   localidadSelect: any;
    //   calle: string = '';

    //   provincias: any = [];
    //   localidades: any = [];

    //   direccionReverse: string = '';

    //   direccion: any = {};

    private tipo: string;
    private ranking: number;
    private timeoutHandle: number;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        public toast: ToastProvider,
        public assetProvider: ConstanteProvider,
        public pacienteProvider: PacienteProvider,
        private nativeGeocoder: NativeGeocoder,
        public alertCtrl: AlertController,
        private diagnostic: Diagnostic,
        private device: Device
    ) {
    }

    ionViewDidLoad() {
        this.tipo = this.navParams.get("tipo");
        if (this.tipo == 'Donde vivo') {
            this.ranking = 0;
        } else if (this.tipo == 'Donde trabajo') {
            this.ranking = 1;
        }

        this.paciente = this.pacienteProvider.paciente;
        if (this.paciente.direccion.length > 0) {
            // buscamos la direccion con ranking = 0 que pertenece a donde vive el paciente
            let dir = this.paciente.direccion.find(dir => dir.ranking == this.ranking);
            if (dir) {
                this._localidad = dir.ubicacion.localidad.nombre;
                this._direccion = dir.valor;
                this._provincia = dir.ubicacion.provincia.nombre;
            }
        }


        // Promise.all([
        //     this.platform.ready(),
        //     this.mapsProvider.onInit,
        //     this.assetProvider.provincias()
        // ]).then(data => {

        //     // obtenemos el paciente
        //     this.paciente = this.pacienteProvider.paciente;

        //     // provincias para el select
        //     this.provincias = data[2];

        //     // buscamos la direccion del paciente
        //     if (this.paciente.direccion.length > 0) {
        //         // buscamos la direccion con ranking = 0 que pertenece a donde vive el paciente
        //         this.direccion = this.paciente.direccion.find(dir => dir.ranking == this.ranking);

        //         if (this.direccion && this.direccion.ubicacion && this.direccion.ubicacion.provincia) {
        //             // cargamos la calle
        //             this.calle = this.direccion.valor;

        //             // buscamos la provincia para seleccionar la opcion del select
        //             this.provinciaSelect = this.provincias.find(item => item.nombre == this.direccion.ubicacion.provincia.nombre);

        //             this.assetProvider.localidades({ provincia: this.provinciaSelect.id }).then((data) => {
        //                 // asignamos las localidades
        //                 this.localidades = data;

        //                 // buscamos la opcion seleccionada del select
        //                 this.localidadSelect = this.localidades.find(item => item.nombre == this.direccion.ubicacion.localidad.nombre);

        //                 this.direccionReverse = this.provinciaSelect.nombre + " " + this.localidadSelect.nombre + " " + this.calle;
        //             });
        //         }
        //     }

        //     // cargamos el mapa
        //     //   this.loadMap(this.direccion);

        // }).catch((error: any) => { console.log(error); });

    }

    // hayUbicacion(state) {
    //     if ((this.device.platform === "Android" && state !== this.diagnostic.locationMode.LOCATION_OFF)
    //         || (this.device.platform === "iOS") && (state === this.diagnostic.permissionStatus.GRANTED
    //             || state === this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE
    //         )) {
    //         this.loadMarker();
    //     }
    // }

    // mostrarAlerta() {
    //     let alert = this.alertCtrl.create({
    //         title: 'Acceder a ubicación',
    //         subTitle: 'Para poder utilizar este servicio, deberá activar la ubicación en su dispositivo.',
    //         buttons: [{
    //             text: 'Continuar',
    //             handler: () => {
    //                 // mostramos el dialogo de ubicacion
    //                 this.diagnostic.switchToLocationSettings();
    //                 // registramos el evento cuando se cambia el estado al servicio de ubicacion
    //                 this.diagnostic.registerLocationStateChangeHandler((state) => this.hayUbicacion(state));
    //             }
    //         }]
    //     });
    //     alert.present();
    // }

    // loadMarker() {
    //     if (this.direccion && this.direccion.geoReferencia) {
    //         let marker = {
    //             latitude: this.direccion.geoReferencia[0],
    //             longitude: this.direccion.geoReferencia[1],
    //             title: this.tipo
    //         }

    //         this.mapObject.addMarker(marker, { draggable: true });

    //         //this.mapObject.setCenter({lat: marker.latitude, lnt: marker.longitude});
    //     } else {

    //         this.mapsProvider.getGeolocation().then((location) => {

    //             let marker = {
    //                 latitude: location.coords.latitude,
    //                 longitude: location.coords.longitude,
    //                 title: this.tipo
    //             }

    //             this.mapObject.addMarker(marker, { draggable: true });

    //             //this.mapObject.setCenter({lat: marker.latitude, lnt: marker.longitude});
    //         }).catch(error => {
    //             this.toast.danger('Debe activar los servicios de ubicación');
    //         });
    //     }
    // }

    // loadMap(direccion) {
    //     this.mapObject = this.mapsProvider.createMap(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);

    //     // consultamos si el servicio de ubicacion esta disponible
    //     this.diagnostic.isLocationAvailable().then((available) => {
    //         if (!available) {
    //             // mostramos el dialogo de ubicacion
    //             // this.diagnostic.switchToLocationSettings();
    //             // registramos el evento cuando se cambia el estado al servicio de ubicacion
    //             // this.diagnostic.registerLocationStateChangeHandler((state) => this.hayUbicacion(state));
    //             this.mostrarAlerta();
    //         }

    //     }, function (error) {
    //         alert("The following error occurred: " + error);
    //     });

    // }

    // onChangeProvincia() {
    //     this.assetProvider.localidades({ provincia: this.provinciaSelect.id }).then((data) => { this.localidades = data });
    //     this.refreshMarker();
    // }

    // onChangeLocalidad() {
    //     this.refreshMarker();
    // }

    // onChangeDireccion() {
    //     if (this.timeoutHandle) {
    //         window.clearTimeout(this.timeoutHandle);
    //     }

    //     if (this.calle) {
    //         this.timeoutHandle = window.setTimeout(() => {
    //             this.timeoutHandle = null;

    //             this.timeoutHandle;
    //             this.refreshMarker();
    //         }, 500);
    //     }
    // }

    // refreshMarker() {
    //     this.direccionReverse = '';

    //     // seteamos provincia
    //     if (this.provinciaSelect && this.provinciaSelect.nombre) {
    //         this.direccionReverse += this.provinciaSelect.nombre;
    //     }

    //     // seteamos localidad
    //     if (this.localidadSelect && this.localidadSelect.nombre) {
    //         this.direccionReverse += ' ' + this.localidadSelect.nombre;
    //     }

    //     // seteamos direccion
    //     if (this.calle) {
    //         this.direccionReverse += ' ' + this.calle;
    //     }


    //     if (this.provinciaSelect && this.provinciaSelect.nombre
    //         && this.localidadSelect && this.localidadSelect.nombre
    //         && this.calle) {

    //         this.nativeGeocoder.forwardGeocode(this.direccionReverse).then((coordinates: NativeGeocoderForwardResult) => {
    //             // borramos los marcadores
    //             this.mapObject.deleteAllMarkers();

    //             let marker = {
    //                 latitude: coordinates.latitude,
    //                 longitude: coordinates.longitude,
    //                 title: 'Donde vivo'
    //             };

    //             this.mapObject.addMarker(marker, { draggable: true });
    //             //this.mapObject.setCenter({lat: marker.latitude, lnt: marker.longitude});
    //         }).catch((error: any) => console.log(error));
    //     }
    // }

    onSave() {

        if (this._direccion.length && this._provincia.length && this._localidad.length) {

            let direccion = {
                ranking: this.ranking,
                valor: this._direccion,
                codigoPostal: '0',
                ubicacion: {
                    localidad: {
                        nombre: this._localidad
                    },
                    provincia: {
                        nombre: this._provincia
                    },
                    pais: {
                        nombre: 'Argentina'
                    }
                }
            }

            // obtenemos latitud y longitud del marker
            // if (this.mapObject.markers[this.mapObject.markers.length - 1]) {
            //     let latLng = this.mapObject.markers[this.mapObject.markers.length - 1].getPosition();
            //     if (latLng) {
            //       this.direccion.geoReferencia = [latLng.lat(), latLng.lng()];
            //     }
            //   }

            // } else {
            //   let alert = this.alertCtrl.create({
            //     title: 'Guardar dirección ' + this.tipo,
            //     subTitle: 'Deberá completar los valores para provincia, localidad y calle.',
            //     buttons: ['Continuar']
            //   });

            //   alert.present();

            //   return false;
            // }


            let index = this.paciente.direccion.findIndex(dir => dir.ranking == this.ranking);

            // si existe lo reemplazamos
            if (index !== -1) {
                this.paciente.direccion[index] = direccion;
            } else {
                // si no existe lo agregamos sobre el array
                this.paciente.direccion.push(direccion);
            }

            let data = {
                op: 'updateDireccion',
                direccion: this.paciente.direccion
            };
            this.inProgress = true;
            this.pacienteProvider.update(this.paciente.id, data).then(() => {
                this.inProgress = false;
                this.toast.success('DATOS MODIFICADOS CORRECTAMENTE');
                // this.navCtrl.pop();
            }).catch(() => {
                this.inProgress = false;
                this.toast.success('ERROR AL GUARDAR');
            })

        }

        /*
        geolocalizar(tipo) {
          let stringLocation = this.provSelect.nombre + ' ' + this.localidadSelect.nombre + ' ' + this.direccion;

          this.nativeGeocoder.forwardGeocode(stringLocation).then((coordinates: NativeGeocoderForwardResult) => {
            this[tipo].geoReferencia = [coordinates.latitude, coordinates.longitude];


          }).catch((error: any) => console.log(error));
          */
    }
}
