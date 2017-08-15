import { Subscription } from 'rxjs';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { LocationsProvider } from '../../../providers/locations/locations';
import { GoogleMapsProvider } from '../../../providers/google-maps/google-maps';

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
  mapObject: any;
  geoSubcribe;
  myPosition;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public maps: GoogleMapsProvider,
    public platform: Platform,
    public locations: LocationsProvider,
    private geolocation: Geolocation) { }


  ngOnDestroy() {
    this.geoSubcribe.unsubscribe();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {

      this.maps.onInit.then(() => {
        console.log('Map created!');
        this.mapObject = this.maps.createMap(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);


        this.locations.load().then((locations) => {
          console.log('Locationsm', locations);
          for (let location of locations) {
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
          } else {
            this.myPosition.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          }


        });

      });

    });


  }


}

