import { Subscription } from 'rxjs';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { LocationsProvider } from '../../../providers/locations/locations';
import { GoogleMapsProvider } from '../../../providers/google-maps/google-maps';

import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

declare var google;

/**
 * Generated class for the MapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
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

  organizacionesCache: any = {};

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
    private nativeGeocoder: NativeGeocoder) {    

    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {

      this.maps.onInit.then(() => {
        console.log('Map created!');
        this.mapObject = this.maps.createMap(this.mapElement.nativeElement, this.panelElement.nativeElement, this.pleaseConnect.nativeElement);       

        // this.locations.load().then((locations) => {
          // let data = {};
          this.locations.get().then((locations) => {
            this.organizacionesCache = locations;
          console.log('Locationsm', locations);
          debugger;
          for (let location of this.organizacionesCache) {
            location.image = 'assets/icon/hospitallocation.png';
            this.mapObject.addMarker(location);
          }
        });

        this.geoSubcribe = this.maps.watchPosition().subscribe(position => {
          console.log('Mi posicion', position);
          if (!this.myPosition) {
            let marker = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              image: 'assets/icon/estoy_aca.png'
            }
            this.myPosition = this.mapObject.addMarker(marker);
            this.mapObject.miPosicion(position);
          } else {
            this.mapObject.miPosicion(position);
            this.myPosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          }
        });

      });

    });
  }

  ngOnDestroy() {
    this.geoSubcribe.unsubscribe();
  }

  chooseItem(item: any) {
    this.autocomplete.query = item;

    this.nativeGeocoder.forwardGeocode(item)
      .then((coordinates: NativeGeocoderForwardResult) => {

        let marker = {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          image: 'assets/icon/estoy_aca.png'
        }
        this.mapObject.addMarker(marker);
      })
      .catch((error: any) => console.log(error));

    this.autocompleteItems = [];
  }

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

