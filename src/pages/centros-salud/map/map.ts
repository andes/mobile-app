import { Subscription } from 'rxjs';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { LocationsProvider } from '../../../providers/locations/locations';
import { GoogleMapsProvider } from '../../../providers/google-maps/google-maps';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Device } from '@ionic-native/device';

declare var google;

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {
  markers: any = [];
  mapObject: any;
  geoSubcribe;
  myPosition;

  panelObject: any;

  autocompleteItems;
  autocomplete;
  service = new google.maps.places.AutocompleteService();
  direccion: any;

  organizacionesCache: any = {};

  private customPosition = false;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('panel') panelElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  constructor(
    private zone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams,
    public maps: GoogleMapsProvider,
    public platform: Platform,
    public locations: LocationsProvider,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private diagnostic: Diagnostic,
    private device: Device,
    private alertCtrl: AlertController) {

    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {

      this.maps.onInit.then(() => {
        console.log('Map created!');
        // this.mapObject = this.maps.createMap(this.mapElement.nativeElement, this.panelElement.nativeElement, this.pleaseConnect.nativeElement);
        this.mapObject = this.maps.createMap(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);

        this.locations.get().then((locations) => {
          this.organizacionesCache = locations;

          for (let location of this.organizacionesCache) {

            let marker = {
              latitude: location.coordenadasDeMapa.latitud,
              longitude: location.coordenadasDeMapa.longitud,
              image: 'assets/icon/hospitallocation.png',
              title: location.nombre,
              address: location.domicilio.direccion
            }

            this.mapObject.addMarker(marker);
          }
        }).catch((error: any) => console.log(error));

        // consultamos si el servicio de ubicacion esta disponible
        this.diagnostic.isLocationAvailable().then((available) => {
          if (!available) {
            // largamos alert para avisar que se van a acceder a los servicios de ubicacion
            this.mostrarAlerta();

          } else {
            this.geoPosicionarme();
          }

        }, function (error) {
          alert("The following error occurred: " + error);
        });

      }).catch((error: any) => console.log(error));

    }).catch((error: any) => console.log(error));
  }

  mostrarAlerta() {
    let alert = this.alertCtrl.create({
      title: 'Acceder a ubicación',
      subTitle: 'Para poder utilizar este servicio, deberá activar la ubicación en su dispositivo.',
      buttons: [{
        text: 'Continuar',
        handler: () => {
          // mostramos el dialogo de ubicacion
          this.diagnostic.switchToLocationSettings();
          // registramos el evento cuando se cambia el estado al servicio de ubicacion
          this.diagnostic.registerLocationStateChangeHandler((state) => this.hayUbicacion(state));
        }
      }]
    });
    alert.present();

  }
  hayUbicacion(state) {
    if ((this.device.platform === "Android" && state !== this.diagnostic.locationMode.LOCATION_OFF)
      || (this.device.platform === "iOS") && (state === this.diagnostic.permissionStatus.GRANTED
        || state === this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE
      )) {

      this.geoPosicionarme();

    }
  }

  geoPosicionarme() {
    this.geoSubcribe = this.maps.watchPosition().subscribe(position => {
      this.maps.setPosition(position);
      if (!this.customPosition) {
        if (position.coords) {
          let i = 0;
          this.nativeGeocoder.reverseGeocode(position.coords.latitude, position.coords.longitude)
            .then((result: NativeGeocoderReverseResult) => {

              let myLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }

              this.direccion = result.thoroughfare + ' N° ' + result.subThoroughfare;

              if (!this.myPosition) {

                let marker = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  image: 'assets/icon/estoy_aca.png',
                  title: 'Estoy Acá',
                  address: this.direccion,
                  index: i++
                }

                this.myPosition = this.mapObject.addMarker(marker);
                this.mapObject.miPosicion(position);
              } else {
                this.mapObject.miPosicion(position);
                this.myPosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
              }
            }).catch(error => { console.log(error) });
        }

      }
    });
  }

  ngOnDestroy() {
    this.geoSubcribe.unsubscribe();
  }

  /* Se comenta hasta que se defina bien como va a funcionar*/
  // chooseItem(item: any) {
  //   this.autocomplete.query = item;

  //   this.nativeGeocoder.forwardGeocode(item)
  //     .then((coordinates: NativeGeocoderForwardResult) => {

  //       let marker = {
  //         latitude: coordinates.latitude,
  //         longitude: coordinates.longitude,
  //         image: 'assets/icon/estoy_aca.png',
  //         title: 'Dirección Elegida',
  //         address: item
  //       }

  //       this.mapObject.addMarker(marker);
  //       let position = {
  //         coords: {
  //           latitude: coordinates.latitude,
  //           longitude: coordinates.longitude
  //         }
  //       }
  //       this.customPosition = true;
  //       this.mapObject.miPosicion(position);
  //       this.mapObject.setCenter({ lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude) });

  //     })
  //     .catch((error: any) => console.log(error));

  //   this.autocompleteItems = [];
  // }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }

    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: { country: 'AR' } }, function (predictions, status) {
      me.autocompleteItems = [];
      me.zone.run(function () {
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }

}

