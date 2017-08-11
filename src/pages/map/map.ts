import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LocationsProvider } from '../../providers/locations/locations';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

import { Geolocation } from '@ionic-native/geolocation';

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
  map: any;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams, public maps: GoogleMapsProvider,
    public platform: Platform, public locations: LocationsProvider, private geolocation: Geolocation) {
    this.getCurrentLocation();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {

      let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
      let locationsLoaded = this.locations.load();

      Promise.all([
        mapLoaded,
        locationsLoaded
      ]).then((result) => {

        let locations = result[1];

        for (let location of locations) {
          location.image = 'assets/icon/hospitallocation.png';
          this.maps.addMarker(location);
        }
        this.getCurrentLocation();
      });

    });
  }

  getCurrentLocation() {
    let options = {
      enableHighAccuracy: true
    };

    this.geolocation.getCurrentPosition(options).then((resp) => {

      let posicion = {
        latitude: resp.coords.latitude,
        longitude: resp.coords.longitude,
        title: 'Estoy Acá',
        image: 'assets/icon/estoy_aca.png'
      };

      this.maps.addMarker(posicion);
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   // data.coords.latitude
    //   // data.coords.longitude
    // });
  }



  // let options = {
  //   enableHighAccuracy: true
  // };

  // this.geolocation.getCurrentPosition(options).then((resp) => {

  //   let posicion = {
  //     lat: resp.coords.latitude,
  //     lng: resp.coords.longitude,
  //     title: 'Estoy Acá',
  //     image: 'assets/icon/hospitallocation.png'
  //   };
  //   debugger;
  //   this.map.addMarker(posicion);       

  //   //this.locations.getCurrentLocation(posicion);

  // }).catch((error) => {
  //   console.log('Error getting location', error);
  // });

  // let watch = this.geolocation.watchPosition();
  // watch.subscribe((data) => {
  //   // data can be a set of coordinates, or an error (if an error occurred).
  //   // data.coords.latitude
  //   // data.coords.longitude
  // });
}

